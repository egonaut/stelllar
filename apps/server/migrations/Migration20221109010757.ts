import { Migration } from '@mikro-orm/migrations';

export class Migration20221109010757 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "user" ("id" varchar(255) not null, "created_at" timestamptz(0) null default \'now\', "name" text not null, "email" text not null, "email_verified" timestamptz(0) null, "image" varchar(255) null, "last_login_at" timestamptz(0) null, "online_status" text check ("online_status" in (\'Online\', \'Away\', \'DoNotDisturb\', \'Offline\')) not null default \'Online\', "is_admin" boolean not null default false, "color" text check ("color" in (\'Red\', \'Yellow\', \'Green\', \'Blue\', \'Indigo\', \'Purple\', \'Pink\')) null default \'Blue\', "is_deleted" boolean not null default false, "is_banned" boolean not null default false, "ban_reason" text null, "is_og" boolean not null default false, "is_staff" boolean not null default false, constraint "user_pkey" primary key ("id"));');
    this.addSql('alter table "user" add constraint "user_name_unique" unique ("name");');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');

    this.addSql('create table "session" ("id" varchar(255) not null, "user_id" varchar(255) not null, "expires" timestamptz(0) not null, "session_token" varchar(255) not null, constraint "session_pkey" primary key ("id"));');
    this.addSql('alter table "session" add constraint "session_session_token_unique" unique ("session_token");');

    this.addSql('create table "server" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "name" text not null, "display_name" text not null, "description" text null, "owner_id" varchar(255) not null, "category" text check ("category" in (\'Arts\', \'Business\', \'Culture\', \'Discussion\', \'Entertainment\', \'Gaming\', \'Health\', \'Hobbies\', \'Lifestyle\', \'Memes\', \'Meta\', \'News\', \'Politics\', \'Programming\', \'Science\', \'Sports\', \'Technology\', \'Other\')) not null default \'Other\', "user_count" int not null default 0, "avatar_url" text null, "banner_url" text null, "is_banned" boolean not null default false, "is_deleted" boolean not null default false, "is_public" boolean not null default true, "is_chat_enabled" boolean not null default true, "is_downvotes_enabled" boolean not null default false, "is_featured" boolean not null default false, constraint "server_pkey" primary key ("id"));');

    this.addSql('create table "role" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "name" text not null, "server_id" varchar(255) not null, "is_default" boolean not null default false, "color" varchar(255) null, "permissions" text[] not null default \'{SendMessages}\', constraint "role_pkey" primary key ("id"));');

    this.addSql('create table "server_user" ("user_id" varchar(255) not null, "server_id" varchar(255) not null, "position" text not null default \'U\', "created_at" timestamptz(0) not null, "role_id" varchar(255) not null, "status" text check ("status" in (\'None\', \'Joined\', \'Banned\')) not null default \'Joined\', constraint "server_user_pkey" primary key ("user_id", "server_id"));');

    this.addSql('create table "channel" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "name" text null, "description" text null, "server_id" varchar(255) not null, "position" text not null default \'U\', "type" text check ("type" in (\'Public\', \'Restricted\', \'Private\')) not null default \'Public\', "is_deleted" boolean not null default false, "last_message_at" timestamptz(0) not null, "is_default" boolean not null default false, constraint "channel_pkey" primary key ("id"));');

    this.addSql('create table "relationship" ("owner_id" varchar(255) not null, "user_id" varchar(255) not null, "created_at" timestamptz(0) not null, "show_chat" boolean not null default false, "status" text check ("status" in (\'None\', \'FriendRequestOutgoing\', \'FriendRequestIncoming\', \'Friends\', \'Blocking\', \'Blocked\')) not null default \'None\', "last_view_at" timestamptz(0) not null, "last_message_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "unread_count" int not null default 0, constraint "relationship_pkey" primary key ("owner_id", "user_id"));');

    this.addSql('create table "post" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "title" text not null, "text" text null, "link_url" text null, "link_metadata" jsonb null, "link_metadatas" jsonb not null, "images" jsonb not null, "author_id" varchar(255) not null, "is_pinned" boolean not null default false, "pinned_at" timestamptz(0) null, "server_id" varchar(255) not null, "vote_count" int not null default 0, "comment_count" int not null default 0, "updated_at" timestamptz(0) null, "is_deleted" boolean not null default false, constraint "post_pkey" primary key ("id"));');

    this.addSql('create table "post_vote" ("user_id" varchar(255) not null, "post_id" varchar(255) not null, "created_at" timestamptz(0) not null, "type" text check ("type" in (\'Up\', \'None\', \'Down\')) not null default \'None\', constraint "post_vote_pkey" primary key ("user_id", "post_id"));');

    this.addSql('create table "group" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "owner_id" varchar(255) not null, "name" text not null, "avatar_url" text null, "last_message_at" timestamptz(0) not null, constraint "group_pkey" primary key ("id"));');

    this.addSql('create table "message" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "author_id" varchar(255) not null, "channel_id" varchar(255) null, "group_id" varchar(255) null, "to_user_id" varchar(255) null, "text" text null, "images" jsonb not null, "file" jsonb null, "link_metadatas" jsonb not null, "is_everyone_mentioned" boolean not null default false, "is_pinned" boolean not null default false, "updated_at" timestamptz(0) null, "pinned_at" timestamptz(0) null, "is_deleted" boolean not null default false, "type" text check ("type" in (\'Normal\', \'Join\', \'Left\', \'FriendRequestReceived\', \'Initial\')) not null default \'Normal\', constraint "message_pkey" primary key ("id"));');

    this.addSql('create table "message_mentioned_users" ("message_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "message_mentioned_users_pkey" primary key ("message_id", "user_id"));');

    this.addSql('create table "group_user" ("user_id" varchar(255) not null, "group_id" varchar(255) not null, "last_view_at" timestamptz(0) not null, "last_message_at" timestamptz(0) not null, "unread_count" int not null default 0, constraint "group_user_pkey" primary key ("user_id", "group_id"));');

    this.addSql('create table "group_users" ("group_id" varchar(255) not null, "user_id" varchar(255) not null, constraint "group_users_pkey" primary key ("group_id", "user_id"));');

    this.addSql('create table "folder" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "name" text not null, "description" text null, "avatar_url" text null, "owner_id" varchar(255) null, "server_id" varchar(255) null, "is_deleted" boolean not null default false, "post_count" int not null default 0, "follower_count" int not null default 0, "is_collaborative" boolean not null default false, "visibility" text check ("visibility" in (\'Public\', \'Friends\', \'Private\', \'Unlisted\')) not null default \'Public\', constraint "folder_pkey" primary key ("id"));');

    this.addSql('create table "server_folder" ("server_id" varchar(255) not null, "folder_id" varchar(255) not null, "position" text not null default \'U\', constraint "server_folder_pkey" primary key ("server_id", "folder_id"));');
    this.addSql('alter table "server_folder" add constraint "server_folder_folder_id_unique" unique ("folder_id");');

    this.addSql('create table "folder_post" ("post_id" varchar(255) not null, "folder_id" varchar(255) not null, "added_by_user_id" varchar(255) not null, "added_at" timestamptz(0) not null, constraint "folder_post_pkey" primary key ("post_id", "folder_id", "added_by_user_id"));');

    this.addSql('create table "comment" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "author_id" varchar(255) not null, "post_id" varchar(255) not null, "text" text not null, "parent_comment_id" varchar(255) null, "vote_count" int not null default 0, "is_pinned" boolean not null default false, "pinned_at" timestamptz(0) null, "updated_at" timestamptz(0) null, "is_deleted" boolean not null default false, "link_metadatas" jsonb not null, constraint "comment_pkey" primary key ("id"));');

    this.addSql('create table "reply" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "user_id" varchar(255) not null, "comment_id" varchar(255) not null, "is_read" boolean not null default false, constraint "reply_pkey" primary key ("id"));');

    this.addSql('create table "comment_vote" ("user_id" varchar(255) not null, "comment_id" varchar(255) not null, "created_at" timestamptz(0) not null, "type" text check ("type" in (\'Up\', \'None\', \'Down\')) not null default \'None\', constraint "comment_vote_pkey" primary key ("user_id", "comment_id"));');

    this.addSql('create table "channel_user" ("user_id" varchar(255) not null, "channel_id" varchar(255) not null, "last_view_at" timestamptz(0) not null, "mention_count" int not null default 0, constraint "channel_user_pkey" primary key ("user_id", "channel_id"));');

    this.addSql('create table "account" ("id" varchar(255) not null, "user_id" varchar(255) not null, "type" varchar(255) not null, "provider" varchar(255) not null, "provider_account_id" varchar(255) not null, "refresh_token" varchar(255) null, "access_token" varchar(255) null, "expires_at" int null, "token_type" varchar(255) null, "scope" varchar(255) null, "id_token" text null, "session_state" varchar(255) null, constraint "account_pkey" primary key ("id"));');
    this.addSql('alter table "account" add constraint "account_provider_provider_account_id_unique" unique ("provider", "provider_account_id");');

    this.addSql('create table "user_folder" ("user_id" varchar(255) not null, "folder_id" varchar(255) not null, "position" text not null default \'U\', constraint "user_folder_pkey" primary key ("user_id", "folder_id"));');

    this.addSql('alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "server" add constraint "server_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "role" add constraint "role_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;');

    this.addSql('alter table "server_user" add constraint "server_user_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "server_user" add constraint "server_user_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;');
    this.addSql('alter table "server_user" add constraint "server_user_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade;');

    this.addSql('alter table "channel" add constraint "channel_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;');

    this.addSql('alter table "relationship" add constraint "relationship_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "relationship" add constraint "relationship_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "post" add constraint "post_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post" add constraint "post_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;');

    this.addSql('alter table "post_vote" add constraint "post_vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "post_vote" add constraint "post_vote_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');

    this.addSql('alter table "group" add constraint "group_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "message" add constraint "message_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "message" add constraint "message_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade on delete set null;');
    this.addSql('alter table "message" add constraint "message_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete set null;');
    this.addSql('alter table "message" add constraint "message_to_user_id_foreign" foreign key ("to_user_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "message_mentioned_users" add constraint "message_mentioned_users_message_id_foreign" foreign key ("message_id") references "message" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "message_mentioned_users" add constraint "message_mentioned_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "group_user" add constraint "group_user_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "group_user" add constraint "group_user_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade;');

    this.addSql('alter table "group_users" add constraint "group_users_group_id_foreign" foreign key ("group_id") references "group" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "group_users" add constraint "group_users_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "folder" add constraint "folder_owner_id_foreign" foreign key ("owner_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "folder" add constraint "folder_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade on delete set null;');

    this.addSql('alter table "server_folder" add constraint "server_folder_server_id_foreign" foreign key ("server_id") references "server" ("id") on update cascade;');
    this.addSql('alter table "server_folder" add constraint "server_folder_folder_id_foreign" foreign key ("folder_id") references "folder" ("id") on update cascade;');

    this.addSql('alter table "folder_post" add constraint "folder_post_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "folder_post" add constraint "folder_post_folder_id_foreign" foreign key ("folder_id") references "folder" ("id") on update cascade;');
    this.addSql('alter table "folder_post" add constraint "folder_post_added_by_user_id_foreign" foreign key ("added_by_user_id") references "user" ("id") on update cascade;');

    this.addSql('alter table "comment" add constraint "comment_author_id_foreign" foreign key ("author_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_post_id_foreign" foreign key ("post_id") references "post" ("id") on update cascade;');
    this.addSql('alter table "comment" add constraint "comment_parent_comment_id_foreign" foreign key ("parent_comment_id") references "comment" ("id") on update cascade on delete set null;');

    this.addSql('alter table "reply" add constraint "reply_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "reply" add constraint "reply_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "comment_vote" add constraint "comment_vote_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "comment_vote" add constraint "comment_vote_comment_id_foreign" foreign key ("comment_id") references "comment" ("id") on update cascade;');

    this.addSql('alter table "channel_user" add constraint "channel_user_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "channel_user" add constraint "channel_user_channel_id_foreign" foreign key ("channel_id") references "channel" ("id") on update cascade;');

    this.addSql('alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "user_folder" add constraint "user_folder_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "user_folder" add constraint "user_folder_folder_id_foreign" foreign key ("folder_id") references "folder" ("id") on update cascade;');
  }

}
