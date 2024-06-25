import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnStatusTableRole1718944464588
  implements MigrationInterface
{
  name = 'AddColumnStatusTableRole1718944464588';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'role',
      new TableColumn({
        name: 'status',
        type: 'active_status',
        default: `'active'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role', 'status');
  }
}
