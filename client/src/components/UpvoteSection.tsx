import { Box, Flex, IconButton } from '@chakra-ui/react'
import { ChevronUpIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { PostWithUserInfoFragment, useVoteMutation, VoteType } from '../generated/graphql'
import { useState } from 'react'

interface UpvoteSectionProps {
  post: PostWithUserInfoFragment
}

enum VoteTypeValues {
  Upvote = 1,
  Downvote = -1,
}

const UpvoteSection = ({ post }: UpvoteSectionProps) => {
  const [vote, {loading}] = useVoteMutation()

  const [loadingState, setLoadingState] = useState<
    'upvote-loading' | 'downvote-loading' | 'not-loading'
  >('not-loading')

  const handleUpvote = async (postId: string) => {
    setLoadingState('upvote-loading')
    await vote({variables: {
      inputVoteValue: VoteType.Upvote,
      postId: +postId
    }})
    setLoadingState('not-loading')
  }

  const handleDownvote = async (postId: string) => {   
    setLoadingState('downvote-loading')
    await vote({variables: {
      inputVoteValue: VoteType.Downvote,
      postId: +postId
    }})
    setLoadingState('not-loading')
  }

  return (
    <Flex
      direction='column'
      alignItems='center'
      mr={4}
    >
      <IconButton
        icon={<ChevronUpIcon />}
        aria-label='upvote'
        onClick={post.voteType === VoteTypeValues.Upvote ? undefined : handleUpvote.bind(this, post.id)}
        isLoading={loading && loadingState === 'upvote-loading'}
        colorScheme={post.voteType === VoteTypeValues.Upvote ? 'green' : undefined}
      />
      <Box my={2}>{post.points}</Box>
      <IconButton
        icon={<ChevronDownIcon />}
        aria-label='downvote'
        onClick={post.voteType === VoteTypeValues.Downvote ? undefined : handleDownvote.bind(this, post.id)}
        isLoading={loading && loadingState === 'downvote-loading'}
        colorScheme={post.voteType === VoteTypeValues.Downvote ? 'red' : undefined}
      />
    </Flex>
  )
}

export default UpvoteSection