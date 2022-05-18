import { Box, Button, Flex, Heading, Spinner } from '@chakra-ui/react'
import { GetStaticPaths, GetStaticProps } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import AlertMessage from '../../components/AlertMessage'
import Layout from '../../components/Layout'
import PostButtons from '../../components/PostButtons'
import {
	GetPostByIdDocument,
	GetPostByIdQuery,
	PostIdsDocument,
	PostIdsQuery,
	useGetPostByIdQuery,
	useIsLoginQuery
} from '../../generated/graphql'
import { addApolloState, initializeApollo } from '../../lib/apolloClient'
import { limit } from '../index'

const Post = () => {
	const router = useRouter()
	const postId = router.query.id as string

  const {data: isLoginData} = useIsLoginQuery()

	const { data, loading, error } = useGetPostByIdQuery({
		variables: {
			id: postId
		}
	})

	if (error || !data?.getPostById)
		return <AlertMessage message={error ? error.message : 'Post not found'} />

	return (
		<Layout>
			{loading ? (
				<Flex justifyContent="center" alignItems="center" minH="100vh">
					<Spinner />
				</Flex>
			) : (
				<>
					<Heading mb={4}>{data.getPostById.title}</Heading>
					<Box mb={4}>{data.getPostById.text}</Box>

					<Flex justifyContent="space-between" alignItems="center">
						{isLoginData?.isLogin?.id === data.getPostById.userId.toString() && (
							<Box>
								<PostButtons postId={postId} />
							</Box>
						)}

						<NextLink href="/">
							<Button>Back to Homepage</Button>
						</NextLink>
					</Flex>
				</>
			)}
		</Layout>
	)
}

export const getStaticPaths: GetStaticPaths = async () => {
	// [
	//   {params: {id: '15'}},
	//   {params: {id: '16'}},
	// ]

	const apolloClient = initializeApollo()

	const { data } = await apolloClient.query<PostIdsQuery>({
		query: PostIdsDocument,
		variables: { limit }
	})

	return {
		paths: data.getAllPosts!.paginatedPosts.map((post) => ({
			params: { id: `${post.id}` }
		})),
		fallback: 'blocking'
	}
}

export const getStaticProps: GetStaticProps<
	{ [key: string]: any },
	{ id: string }
> = async ({ params }) => {
	const apolloClient = initializeApollo()

	await apolloClient.query<GetPostByIdQuery>({
		query: GetPostByIdDocument,
		variables: { id: params?.id }
	})

	return addApolloState(apolloClient, { props: {} })
}

export default Post
