import { Module } from '@nestjs/common';
import { RolePermission } from './role-permission.entity';
import { RolePermissionRepository } from './role-permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([RolePermission])],
  providers: [RolePermissionRepository],
  exports: [RolePermissionRepository],
})
export class RolePermissionModule {}
