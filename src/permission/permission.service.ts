import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { Equal, FindOneOptions } from 'typeorm';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ListPermissionQuery } from './dto/list-permission-query.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './permission.entity';
import { PermissionRepository } from './permission.repository';
import { PermissionAction, PermissionSubject } from './permission.type';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { DatabaseService } from 'src/database/database.service';
import { PermissionSubjectData } from './data';

@Injectable()
export class PermissionService extends BaseService<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  ListPermissionQuery,
  PermissionResponseDto,
  PermissionRepository
> {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private i18n: I18nCustomService,
    private databaseService: DatabaseService,
  ) {
    super(permissionRepository, 'Permission', 'permission');
  }

  async createInit() {
    let total = 1;
    let created = 0;

    const permission = await this.permissionRepository.findOne({
      where: {
        action: Equal(PermissionAction.MANAGER),
        subject: Equal(PermissionSubject.ALL),
      },
    });

    if (!permission) {
      await this.permissionRepository.insertRecord({
        name: 'Manager all',
        action: PermissionAction.MANAGER,
        subject: PermissionSubject.ALL,
        code: PermissionAction.MANAGER + '_' + PermissionSubject.ALL,
      });
      created++;
    }

    console.log(
      `>>>>>>>>>>>>>>>>>>>>>>> Create init permission: ${created}/${total}`,
    );
  }

  async createSubjectInit() {
    let total = 0;
    let created = 0;
    let updated = 0;

    total = PermissionSubjectData.reduce(
      (sum, data) => sum + data.permissions.length,
      0,
    );

    await this.databaseService.runTransaction(async (repositories) => {
      const { permissionRepository } = repositories;

      await Promise.all(
        PermissionSubjectData.map(async (data) => {
          const permissions = [...data.permissions];

          await Promise.all(
            permissions.map(async (permission) => {
              const permissionRecord = await permissionRepository.findOne({
                where: {
                  subject: permission.subject,
                  action: permission.action,
                  code: permission.code,
                },
              });

              if (!permissionRecord) {
                await permissionRepository.insertRecord({ ...permission });
                created++;
              } else {
                const result = await permissionRepository.update(
                  { id: permissionRecord.id },
                  { ...permission },
                );
                if (result.affected === 1) {
                  updated++;
                }
              }
            }),
          );
        }),
      );
    });

    console.log(
      `>>>>>>>>>>>>>>>>>>>>>>> Create subject permission: {created: ${created}/${total}, updated: ${updated}/${total}}`,
    );
  }

  async list(
    query: ListPermissionQuery,
  ): Promise<{ records: PermissionResponseDto[]; total: number }> {
    const { page, pageSize } = query;

    const permissionResponseData = await this.permissionRepository.findAndCount(
      {
        where: [],
        skip: page,
        take: pageSize,
      },
    );

    const records = permissionResponseData[0].map((record) =>
      this.permissionRepository.mapResponse(record),
    );

    return { records, total: permissionResponseData[1] };
  }

  async retrieve(
    options: FindOneOptions<Permission>,
  ): Promise<PermissionResponseDto> {
    const permission = await this.permissionRepository.findAndThrowError(
      {
        message: this.i18n.getMessage('errors.common.not_found', {
          args: [{ entity: this.entityName }],
        }),
      },
      options,
    );

    return this.permissionRepository.mapResponse(permission);
  }
}
