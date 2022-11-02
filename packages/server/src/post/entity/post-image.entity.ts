import { Embeddable, Embedded, Property } from '@mikro-orm/core';
import { Field, ObjectType } from '@nestjs/graphql';
import { Image } from './image.entity';

@Embeddable()
@ObjectType()
export class PostImage {
  @Field(() => Image)
  @Embedded({ entity: () => Image, object: true })
  image: Image;

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  linkUrl?: string;

  @Property({ nullable: true, columnType: 'text' })
  @Field({ nullable: true })
  caption?: string;
}