import { BeforeInsert, Column, Entity, ManyToMany } from 'typeorm';
import { SoftDeletableEntity } from '../common/entity/solf-deletetable.entity';
import { generateEntityId } from '../common/utils/generated-entity-id';
import { PermissionConditions } from './permission.type';

@Entity('permission')
export class Permission extends SoftDeletableEntity {
  @Column()
  name: string;

  @Column()
  code: string;

  @Column()
  status?: string;

  @Column()
  action: string;

  @Column()
  subject: string;

  @Column({ type: 'jsonb', nullable: true })
  conditions: PermissionConditions;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'per');
  }
}
