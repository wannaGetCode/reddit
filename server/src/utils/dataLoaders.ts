import { User } from '../entities/User'
import DataLoader from 'dataloader'
import { In } from 'typeorm'
import { Upvote } from '../entities/Upvote'

interface VoteTypeConditions {
  postId: number
  userId: number
}

// userIds = [1, 2]
// => [{id: 1}, {id: 1}, {id: 2}]
const batchGetUsers = async (userIds: number[]) => {
  // const users = userIds.map(async (userId) => await User.findOneBy({id: userId}))
  const users = await User.findBy({id: In(userIds)})
  return userIds.map(userId => users.find(user => user.id === userId))
}

const batchGetVoteType = async (voteTypeConditions: VoteTypeConditions[]) => {
  const voteTypes = await Upvote.findBy({
    postId: In(voteTypeConditions.map(voteTypeCondition => voteTypeCondition.postId)),
    userId: In(voteTypeConditions.map(voteTypeCondition => voteTypeCondition.userId))
  })
  return voteTypeConditions.map(voteTypeCondition => voteTypes.find(voteType => voteTypeCondition.postId === voteTypeCondition.postId && voteType.userId === voteTypeCondition.userId))
}

export const buildDataLoaders = () => ({
  userLoader: new DataLoader<number, User | undefined>(userIds => batchGetUsers(userIds as number[])),
  voteTypeLoader: new DataLoader<VoteTypeConditions, Upvote | undefined>(voteTypeConditions => batchGetVoteType(voteTypeConditions as VoteTypeConditions[])),
})

