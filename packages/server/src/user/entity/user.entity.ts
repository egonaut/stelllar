import { Collection, Entity, Enum, OneToMany, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entity/base.entity';
import { GraphQLEmailAddress, GraphQLNonNegativeInt } from 'graphql-scalars';
import { GraphQLBoolean } from 'graphql/type';
import { OnlineStatus } from './online-status.enum';
import { Relationship } from './relationship.entity';
import { RelationshipStatus } from './relationship-status.enum';

@ObjectType({ implements: BaseEntity })
@Entity()
export class User extends BaseEntity {
  @Field()
  @Property({ columnType: 'text' })
  username: string;

  @Field(() => GraphQLEmailAddress, { nullable: true })
  @Property({ columnType: 'text', nullable: true })
  email: string;

  @Field({ nullable: true })
  @Property({ nullable: true })
  lastLoginAt?: Date;

  @Field({ nullable: true })
  lastMessageAt?: Date;

  @Field({ nullable: true })
  @Property({ nullable: true, columnType: 'text' })
  avatarUrl?: string;

  @Field(() => OnlineStatus)
  @Enum({
    items: () => OnlineStatus,
  })
  onlineStatus: OnlineStatus = OnlineStatus.Online;

  @Field(() => GraphQLBoolean)
  @Property({ columnType: 'boolean' })
  isAdmin = false;

  @Field()
  isCurrentUser: boolean;

  @Property({ columnType: 'text' })
  passwordHash: string;

  @Property({ columnType: 'boolean' })
  isDeleted = false;

  @Property({ columnType: 'boolean' })
  isBanned = false;

  @Property({ nullable: true, columnType: 'text' })
  banReason?: string;

  @OneToMany(() => Relationship, 'owner')
  relationships = new Collection<Relationship>(this);

  @Field(() => [User])
  relatedUsers: User[];

  @Field(() => GraphQLNonNegativeInt)
  unreadCount: number;

  @Field()
  showChat: boolean;

  @Field(() => RelationshipStatus)
  relationshipStatus: RelationshipStatus;

  @Field(() => GraphQLBoolean)
  @Property({ columnType: 'boolean', default: false })
  isOg = false;

  @Field(() => GraphQLBoolean)
  @Property({ columnType: 'boolean', default: false })
  isStaff = false;

  @Field()
  get isOnline(): boolean {
    if (!this.lastLoginAt) return false;
    const timeout = 5 * 60 * 1000; // five minutes
    return new Date().getTime() - this.lastLoginAt.getTime() < timeout;
  }
}
