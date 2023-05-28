import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1685235019036 implements MigrationInterface {
    name = 'Migration1685235019036'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "public"."user" ("id" SERIAL NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, "date_insertion" TIMESTAMP NOT NULL DEFAULT 'now()', "date_modification" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."messages" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "description" character varying NOT NULL, "date_message" character varying NOT NULL, "archived" boolean NOT NULL DEFAULT 'false', "date_insertion" TIMESTAMP NOT NULL DEFAULT 'now()', "date_modification" TIMESTAMP, "userId" integer, CONSTRAINT "PK_18325f38ae6de43878487eff986" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "public"."token" ("id" SERIAL NOT NULL, "token" character varying NOT NULL, "valid" boolean NOT NULL DEFAULT 'true', "userId" integer, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "public"."messages" ADD CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "public"."token" ADD CONSTRAINT "FK_94f168faad896c0786646fa3d4a" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "public"."token" DROP CONSTRAINT "FK_94f168faad896c0786646fa3d4a"`);
        await queryRunner.query(`ALTER TABLE "public"."messages" DROP CONSTRAINT "FK_4838cd4fc48a6ff2d4aa01aa646"`);
        await queryRunner.query(`DROP TABLE "public"."token"`);
        await queryRunner.query(`DROP TABLE "public"."messages"`);
        await queryRunner.query(`DROP TABLE "public"."user"`);
    }

}
