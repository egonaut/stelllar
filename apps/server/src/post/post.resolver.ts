import { Logger } from "@nestjs/common";
import { Args, Mutation, Resolver } from "@nestjs/graphql";
import { CurrentUser } from "../auth/decorator/current-user.decorator";
import { User } from "../user/entity/user.entity";
import { Post } from "./entity/post.entity";
import { CreatePostInput } from "./input/create-post.input";
import { PostService } from "./post.service";

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

  @Mutation(() => Post)
  async createPost(
    @Args("input") input: CreatePostInput,
    @CurrentUser() user: User
  ) {
    Logger.log("createPost");

    return await this.postService.createPost(
      user,
      input.serverId,
      input.title,
      input.linkUrl,
      input.text,
      input.images
    );
  }
}
