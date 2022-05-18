import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Upvote } from './Upvote';
import { User } from './User';

@ObjectType()
@Entity()
export class Post extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column()
  title!: string

  @Field()
  @Column()
  userId!: number

  @Field()
  @ManyToOne(() => User, user => user.posts)
  user: User

  @OneToMany(_to => Upvote, upvote => upvote.post)
  upvotes: Upvote[]

  @Field()
  @Column({ default: 0})
  points!: number

  @Field()
  voteType!: number

  @Field()
  @Column()
  text!: string

  @Field()
  @CreateDateColumn({type: 'timestamp with time zone'})
  createdAt: Date

  @Field()
  @CreateDateColumn({type: 'timestamp with time zone'})
  updatedAt: Date
}