import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1740668358898 implements MigrationInterface {
    name = 'InitialMigration1740668358898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "calories" integer NOT NULL DEFAULT '1', CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product"`);
    }

}
