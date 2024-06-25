import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Role } from './role.entity';
import { Equal, FindOneOptions } from 'typeorm';
import { RoleRepository } from './role.repository';
import { DatabaseService } from 'src/database/database.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListRoleQuery } from './dto/list-role-query.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import {
  PermissionAction,
  PermissionSubject,
} from 'src/permission/permission.type';
import { RoleManagerDataInit } from './role.data';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';

@Injectable()
export class RoleService extends BaseService<
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  ListRoleQuery,
  RoleResponseDto,
  RoleRepository
> {
  constructor(
    private roleRepository: RoleRepository,
    private databaseService: DatabaseService,
    private i18n: I18nCustomService,
  ) {
    super(roleRepository, 'Role', PermissionSubject.ROLE);
  }

  async createInit() {
    let total = 1;
    let created = 0;

    const { permissionRepository } = this.databaseService.getRepositories();

    const permission = await permissionRepository.findOne({
      where: {
        action: Equal(PermissionAction.MANAGER),
        subject: Equal(PermissionSubject.ALL),
      },
    });

    const role = await this.roleRepository.findOne({
      where: { code: RoleManagerDataInit.code },
    });

    if (permission && !role) {
      await this.create({
        name: RoleManagerDataInit.name,
        permissionsId: [permission.id],
        code: RoleManagerDataInit.code,
      });
      created++;
    }

    console.log(
      `>>>>>>>>>>>>>>>>>>>>>>> Create init role: ${created}/${total}`,
    );
  }

  async create(payload: CreateRoleDto): Promise<Role> {
    const role = await this.databaseService.runTransaction<Role>(
      async (repositories) => {
        const { rolePermissionRepository, roleRepository } = repositories;

        const permissionsId = [...payload.permissionsId];

        const newRole = await roleRepository.insertRecord(payload);

        await Promise.all(
          permissionsId.map(async (permissionId) => {
            await rolePermissionRepository.insertRecord({
              roleId: newRole.id,
              permissionId,
            });
          }),
        );

        return newRole;
      },
    );

    return role;
  }

  async list(
    query: ListRoleQuery,
  ): Promise<{ records: RoleResponseDto[]; total: number }> {
    const { page, pageSize } = query;

    const roleResponseData = await this.roleRepository.findAndCount({
      where: [],
      skip: page,
      take: pageSize,
      relations: ['permissions'],
    });

    const records = roleResponseData[0].map((record) =>
      this.roleRepository.mapResponse(record),
    );

    return { records, total: roleResponseData[1] };
  }

  async retrieve(options: FindOneOptions<Role>): Promise<RoleResponseDto> {
    const role = await this.roleRepository.findAndThrowError(
      {
        message: this.i18n.getMessage('errors.common.not_found', {
          args: [{ entity: this.entityName }],
        }),
      },
      options,
    );

    return this.roleRepository.mapResponse(role);
  }
}
