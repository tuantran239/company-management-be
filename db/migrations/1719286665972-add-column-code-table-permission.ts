import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnCodeTablePermission1719286665972
  implements MigrationInterface
{
  name = 'AddColumnCodeTablePermission1719286665972';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'permission',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('permission', 'code');
  }
}
