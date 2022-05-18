import { AuthenticationError } from 'apollo-server-express'
import { MiddlewareFn } from 'type-graphql'
import { Context } from '../types/Context'

export const checkAuth: MiddlewareFn<Context> = ({ context }, next) => {
  const { req } = context
  if (!req.session.userId) {
    throw new AuthenticationError(
      'Not authenticated to perform GraphQL operations'
    )
  }
  
  return next()
}