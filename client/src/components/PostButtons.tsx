import { Reference } from '@apollo/client'
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import { Box, IconButton } from '@chakra-ui/react'
import NextLink from 'next/link'
import router from 'next/router'
import { PaginatedPosts, useDeletePostMutation } from '../generated/graphql'

interface PostButtonsProps {
  postId: string
}

const PostButtons = ({ postId }: PostButtonsProps) => {


  const [deletePost] = useDeletePostMutation()

  const handleDelete = async (postId: string) => {
    await deletePost({
      variables: {id: postId},
      update(cache, {data}) {
        if (data?.deletePost.success) {
          cache.modify({
            fields: {
              getAllPosts(existing: Pick<PaginatedPosts, '__typename' | 'cursor' | 'hasMore' | 'totalCount'> & {paginatedPosts: Reference[]}) {
                const newPostsAfterDeletion = {
                  ...existing,
                  totalCount: existing.totalCount - 1,
                  paginatedPosts: existing.paginatedPosts.filter(postRefObj => postRefObj.__ref !== `Post:${postId}`)
                }

                return newPostsAfterDeletion
              }
            }
          })
        }
      }
    })
    if (router.route !== '/') router.back()
  }

  return (
    <Box>
      <NextLink href={`/post/edit/${postId}`}>
        <IconButton icon={<EditIcon />} aria-label='edit' mr={4} />
      </NextLink>
      <IconButton
        icon={<DeleteIcon />}
        aria-label='delete'
        colorScheme='red'
        onClick={handleDelete.bind(this, postId as string)}
      />
    </Box>
  )
}

export default PostButtons