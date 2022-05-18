require('dotenv').config()
import 'reflect-metadata'
import express from 'express'
import { DataSource } from 'typeorm'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import cors from 'cors'

import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { PostResolver } from './resolvers/post'
import { HelloResolver } from './resolvers/hello'
import { UserResolver } from './resolvers/user'
import { User } from './entities/User'
import { Post } from './entities/Post'
import { Upvote } from './entities/Upvote'
import { buildDataLoaders } from './utils/dataLoaders'
import path from 'path'

const main = async () => {
	const dataSource = new DataSource({
		type: 'postgres',
		...(__prod__
			? { url: process.env.DATABASE_URL }
			: {
					database: 'reddit',
					username: process.env.DB_USERNAME_DEV,
					password: process.env.DB_PASSWORD_DEV
			  }),
		logging: true,
		...(__prod__
			? {
					extra: {
						ssl: {
							rejectUnauthorized: false
						}
					},
					ssl: true
			  }
			: {}),
		...(__prod__ ? {} : { synchronize: true }),
		entities: [User, Post, Upvote],
		migrations: [path.join(__dirname, '/migrations/*')]
	})

  if (__prod__) await dataSource.runMigrations()

	await dataSource.initialize().catch((error) => console.log(error))

	const app = express()

	app.use(
		cors({
			origin: __prod__ ? process.env.CORS_ORIGIN_PROD : process.env.CORS_ORIGIN_DEV,
			credentials: true
		})
	)

	// Session/Cookie store
	const mongoUrl = `mongodb+srv://${process.env.SESSION_DB_USERNAME}:${process.env.SESSION_DB_PASSWORD}@cluster0.7pv9b.mongodb.net/reddit?retryWrites=true&w=majority`
	await mongoose
		.connect(mongoUrl)
		.then(() => console.log('Connected to database successfully'))

	app.use(
		session({
			name: COOKIE_NAME,
			store: MongoStore.create({ mongoUrl }),
			cookie: {
				maxAge: 1000 * 60 * 60, // 1 hour
				httpOnly: true, // JS front end cannot access the cookie
				secure: __prod__, // cookie only works in https
				sameSite: 'lax', // protection against CSRF
        domain: __prod__ ? '.vercel.app' : undefined
			},
			secret: process.env.SESSION_SECRET as string,
			saveUninitialized: false, // don't save empty sessions, right from the start
			resave: false
		})
	)

	const apolloServer = new ApolloServer({
		schema: await buildSchema({
			resolvers: [HelloResolver, UserResolver, PostResolver],
			validate: false
		}),
		context: ({ req, res }): Context => ({
			req,
			res,
			dataSource,
			dataLoaders: buildDataLoaders()
		}),
		plugins: [ApolloServerPluginLandingPageGraphQLPlayground()]
	})

	await apolloServer.start()
	apolloServer.applyMiddleware({ app, cors: false })

	const PORT = process.env.PORT || 4000
	app.listen(PORT, () =>
		console.log(
			`Server started on PORT: ${PORT}. GraphQL server started on localhost: ${PORT}${apolloServer.graphqlPath}`
		)
	)
}

main().catch((error) => console.log(error))
