import {MigrationInterface, QueryRunner} from "typeorm";

export class AddLinkEntity1616626289574 implements MigrationInterface {
    name = 'AddLinkEntity1616626289574'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "link" ("id" SERIAL NOT NULL, "url" text NOT NULL, "token" text NOT NULL, "visits_count" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT now(), CONSTRAINT "PK_26206fb7186da72fbb9eaa3fac9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_8dece3c96270b99f144d26e4a7" ON "link" ("url") `);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_afacfe144a986300891fab3521" ON "link" ("token") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_afacfe144a986300891fab3521"`);
        await queryRunner.query(`DROP INDEX "IDX_8dece3c96270b99f144d26e4a7"`);
        await queryRunner.query(`DROP TABLE "link"`);
    }

}
