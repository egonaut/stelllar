import { Migration } from '@mikro-orm/migrations';

export class Migration20221102154424 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_color_check";');

    this.addSql('alter table "user" alter column "color" drop default;');
    this.addSql('alter table "user" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "user" add constraint "user_color_check" check ("color" in (\'Red\', \'Yellow\', \'Green\', \'Blue\', \'Indigo\', \'Purple\', \'Pink\'));');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop constraint if exists "user_color_check";');

    this.addSql('alter table "user" alter column "color" type text using ("color"::text);');
    this.addSql('alter table "user" add constraint "user_color_check" check ("color" in (\'Red\', \'Yellow\', \'Green\', \'Blue\', \'Indigo\', \'Purple\', \'Pink\'));');
    this.addSql('alter table "user" alter column "color" set default \'Red\';');
  }

}