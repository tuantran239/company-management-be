import { Injectable } from '@nestjs/common';
import { PermissionService } from 'src/permission/permission.service';
import { RoleService } from 'src/role/role.service';

@Injectable()
export class InitService {
  constructor(
    private permissionService: PermissionService,
    private roleService: RoleService,
  ) {
    const permissionServiceInit = this.permissionService;
    const roleServiceInit = this.roleService;

    async function init() {
      await permissionServiceInit.createInit();

      await roleServiceInit.createInit();

      await permissionServiceInit.createSubjectInit();
    }

    init();
  }
}
