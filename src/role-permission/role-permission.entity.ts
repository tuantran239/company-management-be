import { BeforeInsert, Column, Entity } from 'typeorm';
import { generateEntityId } from '../common/utils/generated-entity-id';
import { BaseEntity } from 'src/common/entity/base.entity';

@Entity('role_permission')
export class RolePermission extends BaseEntity{
  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'permission_id' })
  permissionId: string;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'role_per');
  }
}
