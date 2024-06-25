import { Module } from '@nestjs/common';
import { InitService } from './init.service';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleModule } from 'src/role/role.module';

@Module({
  providers: [InitService],
  imports: [PermissionModule, RoleModule],
})
export class InitModule {}
