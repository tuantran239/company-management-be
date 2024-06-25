import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { SoftDeletableEntity } from '../common/entity/solf-deletetable.entity';
import { generateEntityId } from '../common/utils/generated-entity-id';
import { Permission } from 'src/permission/permission.entity';

@Entity('role')
export class Role extends SoftDeletableEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  status: string;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'role_permission',
    joinColumn: {
      name: 'role_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'permission_id',
      referencedColumnName: 'id',
    },
  })
  permissions: Permission[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'role');
  }
}
