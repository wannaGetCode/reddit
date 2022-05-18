import { NetworkStatus } from '@apollo/client'
import { Box, Button, Flex, Heading, Link, Spinner, Stack, Text } from '@chakra-ui/react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'
import NextLink from 'next/link'

import Layout from '../components/Layout'
import PostButtons from '../components/PostButtons'
import { GetAllPostsDocument, useGetAllPostsQuery, useIsLoginQuery } from '../generated/graphql'
import { addApolloState, initializeApollo } from '../lib/apolloClient'
import UpvoteSection from '../components/UpvoteSection'

export const limit = 5

const Index = () => {
  const {data: isLoginData} = useIsLoginQuery()

  const {data, loading, fetchMore, networkStatus} = useGetAllPostsQuery({
    variables: {limit},

    // component which is rendered by Post query, will rerender when networkStatus change (fetchMore)
    notifyOnNetworkStatusChange: true,
  })

  const loadMorePosts = () => fetchMore({variables: {cursor: data?.getAllPosts?.cursor}})

  const loadingMorePosts = networkStatus === NetworkStatus.fetchMore

  return (
    <Layout>
      {loading && !loadMorePosts ? (
        <Flex justifyContent='center' alignItems='center' minH='100vh'>
          <Spinner />
        </Flex>
      ) : (
        <Stack spacing={8} mt={4}>
          {data?.getAllPosts?.paginatedPosts.map(post => (
            <Flex key={post.id} p={5} shadow='md' borderWidth='1px'>
              <UpvoteSection post={post} />
              <Box flex={1}>
                <NextLink href={`/post/${post.id}`}>
                  <Link>
                    <Heading fontSize='xl'>
                      {post.title}
                    </Heading>
                  </Link>
                </NextLink>
                <Text>posted by {post.user.username}</Text>
                <Flex align='center'>
                  <Text mt={4}>{post.textSnippet}</Text>
                  {isLoginData?.isLogin?.id === post.user.id && (
                    <Box ml='auto'>
                      <PostButtons postId={post.id} />
                    </Box>
                  )}
                </Flex>                
              </Box>              
            </Flex>
          ))}
        </Stack>
      )}

      {data?.getAllPosts?.hasMore && (
        <Flex>
          <Button
            m='auto'
            my={8}
            isLoading={loadingMorePosts}
            onClick={loadMorePosts}
          >
            {loadingMorePosts ? 'Loading' : 'Show more'}
          </Button>
        </Flex>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext) => {
  const apolloclient = initializeApollo({headers: context.req.headers})

  await apolloclient.query({
    query: GetAllPostsDocument,
    variables: {
      limit
    }
  })

  return addApolloState(apolloclient, {
    props: {}
  })
}

export default Index
