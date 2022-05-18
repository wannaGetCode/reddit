import { Box, Button, Flex, Text, Heading, Link } from '@chakra-ui/react'
import NextLink from 'next/link'
import { IsLoginDocument, IsLoginQuery, useIsLoginQuery, useLogoutMutation } from '../generated/graphql'
import { Reference, gql } from '@apollo/client'

const Navbar = () => {
  const {data} = useIsLoginQuery()
  const [logoutUser] = useLogoutMutation()

  const handleLogout = () => {
    logoutUser({
      update(cache, {data}) {
        if (data?.logout) {
          cache.writeQuery<IsLoginQuery>({
            query: IsLoginDocument,
            data: {isLogin: null}
          })

          cache.modify({
						fields: {
							getAllPosts(existing) {
								existing.paginatedPosts.forEach((post: Reference) => {
									cache.writeFragment({
										id: post.__ref, // `Post:17`
										fragment: gql`
											fragment VoteType on Post {
												voteType
											}
										`,
										data: {
											voteType: 0
										}
									})
								})

								return existing
							}
						}
					})
        }
      }
    })
  }

  const body = data?.isLogin
    ? (
      <Flex alignItems='center'>
        <Box mr={4}>
          <Text>Welcome, {data.isLogin.username}</Text>
        </Box>
        <NextLink href='/create-post'>
          <Button mr={4}>Create new post</Button>
        </NextLink>
        <Button onClick={handleLogout}>Logout</Button>
      </Flex>
    ) : (
      <Box>
        <NextLink href='/login'>
          <Link mr='2'>Login</Link>
        </NextLink>
        <NextLink href='/register'>
          <Link mr='2'>Register</Link>
        </NextLink>
      </Box>
    )

  return (
    <Box bg='tan' p={4}>
      <Flex
        maxW={800}
        justifyContent='space-between'
        m='auto'
        alignItems='center'
      >
        <NextLink href='/'>
          <Heading cursor='pointer'>Reddit</Heading>
        </NextLink>         
        {body}
      </Flex>
    </Box>
  )
}

export default Navbar