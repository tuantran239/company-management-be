import { SoftDeleteColumn } from 'db/base/soft-delete.migration';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableRole1718936932882 implements MigrationInterface {
  name = 'CreateTableRole1718936932882';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',
        columns: [
          ...SoftDeleteColumn,
          {
            name: 'name',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('role');
  }
}
