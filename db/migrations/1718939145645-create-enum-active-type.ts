import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateEnumActiveType1718939145645 implements MigrationInterface {
  name = 'CreateEnumActiveType1718939145645';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE active_status 
      AS ENUM ('active', 'off');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {}
}
