import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1626057603790 implements MigrationInterface {
    name = 'Initial1626057603790'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "problem" ("id" SERIAL NOT NULL, "onlineJudgeId" character varying NOT NULL, "remoteProblemId" character varying NOT NULL, "remoteLink" character varying NOT NULL, "title" character varying NOT NULL, "timelimit" character varying NOT NULL, "description" character varying NOT NULL, "input" character varying NOT NULL, "output" character varying NOT NULL, "inputExamples" text NOT NULL, "outputExamples" text NOT NULL, CONSTRAINT "PK_119b5ca6f3371465bf1f0f90219" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "username" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "submission_verdict_enum" AS ENUM('Pending', 'Accepted', 'Compilation error', 'Time limit exceeded', 'Presentation error', 'Wrong answer', 'Memory limit exceeded', 'Runtime error')`);
        await queryRunner.query(`CREATE TABLE "submission" ("id" SERIAL NOT NULL, "onlineJudgeId" character varying NOT NULL, "remoteSubmissionId" character varying, "remoteProblemId" character varying NOT NULL, "remoteLanguageId" character varying NOT NULL, "code" character varying NOT NULL, "verdict" "submission_verdict_enum" NOT NULL DEFAULT 'Pending', "createdDate" TIMESTAMP NOT NULL, "authorId" integer, CONSTRAINT "PK_7faa571d0e4a7076e85890c9bd0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "submission" ADD CONSTRAINT "FK_f490698687fe186e88cb5c9a739" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submission" DROP CONSTRAINT "FK_f490698687fe186e88cb5c9a739"`);
        await queryRunner.query(`DROP TABLE "submission"`);
        await queryRunner.query(`DROP TYPE "submission_verdict_enum"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "problem"`);
    }

}
