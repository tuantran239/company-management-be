import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { User } from 'src/user/user.entity';
import { UserRepository } from 'src/user/user.repository';
import { DatabaseService } from './database.service';
import { RolePermission } from 'src/role-permission/role-permission.entity';
import { Role } from 'src/role/role.entity';
import { RoleRepository } from 'src/role/role.repository';
import { PermissionRepository } from 'src/permission/permission.repository';
import { Permission } from 'src/permission/permission.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([User, RolePermission, Role, Permission])],
  providers: [
    DatabaseService,
    UserRepository,
    RolePermissionRepository,
    RoleRepository,
    PermissionRepository,
  ],
  exports: [DatabaseService],
})
export class DatabaseModule {}
