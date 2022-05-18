import { Post } from './Post';
import { Field, ID, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Upvote } from './Upvote';

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field(_type => ID)
  @PrimaryGeneratedColumn()
  id!: number

  @Field()
  @Column({unique: true})
  username!: string

  @Field()
  @Column({unique: true})
  email!: string
  
  @Column()
  password!: string

  @OneToMany(() => Post, post => post.user)
  posts: Post[]

  @OneToMany(_to => Upvote, upvote => upvote.user)
  upvotes: Upvote[]

  @Field()
  @CreateDateColumn()
  createdAt: Date

  @Field()
  @CreateDateColumn()
  updatedAt: Date
}