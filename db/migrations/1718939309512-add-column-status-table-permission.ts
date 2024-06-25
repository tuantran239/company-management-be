import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnStatusTablePermission1718939309512
  implements MigrationInterface
{
  name = 'AddColumnStatusTablePermission1718939309512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'permission',
      new TableColumn({
        name: 'status',
        type: 'active_status',
        default: `'active'`,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('permission', 'status');
  }
}
