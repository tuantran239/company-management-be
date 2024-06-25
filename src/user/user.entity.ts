import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { SoftDeletableEntity } from '../common/entity/solf-deletetable.entity';
import { generateEntityId } from '../common/utils/generated-entity-id';
import { Role } from 'src/role/role.entity';

@Entity('user')
export class User extends SoftDeletableEntity {
  @Column()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ name: 'role_id' })
  roleId: string;

  @Column({ name: 'manager_id' })
  managerId?: string;

  @OneToOne(() => Role)
  @JoinColumn({ name: 'role_id' })
  role: Role;

  @OneToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, 'user');
  }
}
