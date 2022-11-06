import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { DatabaseModule } from "./database/database.module";
import * as Joi from "@hapi/joi";
import { UserModule } from "./user/user.module";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver } from "@nestjs/apollo";
import { FolderModule } from "./folder/folder.module";
import { ServerModule } from "./server/server.module";
import { GroupModule } from "./group/group.module";
import { PostModule } from "./post/post.module";
import { ChannelModule } from "./channel/channel.module";
import { CommentModule } from "./comment/comment.module";
import { MessageModule } from "./message/message.module";
import { AuthModule } from "./auth/auth.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        PORT: Joi.number(),
        JWT_ACCESS_TOKEN_SECRET: Joi.string().required(),
        JWT_ACCESS_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        JWT_REFRESH_TOKEN_SECRET: Joi.string().required(),
        JWT_REFRESH_TOKEN_EXPIRATION_TIME: Joi.string().required(),
        POSTGRES_HOST: Joi.string().required(),
        POSTGRES_PORT: Joi.number().required(),
        POSTGRES_USER: Joi.string().required(),
        POSTGRES_PASSWORD: Joi.string().required(),
        POSTGRES_DB: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      playground: true,
      autoSchemaFile: "packages/server/src/schema.gql",
      context: ({ req, res }) => ({ req, res }),
    }),
    UserModule,
    FolderModule,
    ServerModule,
    GroupModule,
    PostModule,
    ChannelModule,
    CommentModule,
    MessageModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}