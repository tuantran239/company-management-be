import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddColumnCodeTableRole1719211404598 implements MigrationInterface {
  name = 'AddColumnCodeTableRole1719211404598';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'role',
      new TableColumn({
        name: 'code',
        type: 'varchar',
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('role', 'code');
  }
}
