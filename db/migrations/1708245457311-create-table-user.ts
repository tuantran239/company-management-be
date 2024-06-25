import { SoftDeleteColumn } from 'db/base/soft-delete.migration';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class CreateTableUser1708245457311 implements MigrationInterface {
  name = 'CreateTableUser1708245457311';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          ...SoftDeleteColumn,
          {
            name: 'email',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'username',
            type: 'varchar',
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('user');
  }
}
