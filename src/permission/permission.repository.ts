import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Repository } from 'typeorm';
import { Permission } from './permission.entity';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { checkEnumTypeValid } from 'src/common/utils/validate';
import { PermissionAction, PermissionSubject } from './permission.type';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';

export const PERMISSION_RELATIONS = []

@Injectable()
export class PermissionRepository extends BaseRepository<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  PermissionResponseDto
> {
  constructor(
    @InjectRepository(Permission)
    protected repository: Repository<Permission>,
    public i18n: I18nCustomService,
  ) {
    super(repository, PERMISSION_RELATIONS);
  }

  async insertRecord(payload: CreatePermissionDto): Promise<Permission> {
    checkEnumTypeValid(
      PermissionAction,
      [payload.action],
      this.i18n.getMessage('errors.permission.action_type_not_valid'),
    );

    checkEnumTypeValid(
      PermissionSubject,
      [payload.subject],
      this.i18n.getMessage('errors.permission.subject_type_not_valid'),
    );

    const newPermission = await this.create(payload);

    return await this.save(newPermission);
  }

  async updateRecord(
    payload: UpdatePermissionDto & { id: string },
  ): Promise<Permission> {
    const { id } = payload;

    const permission = await this.findAndThrowError({}, { where: { id } });

    const keysPayload = Object.keys(payload);

    for (let i = 0; i < keysPayload.length; i++) {
      const key = keysPayload[i];

      const payloadValue = payload[key];

      const permissionValue = permission[key];

      if (permissionValue !== undefined && permissionValue !== payloadValue) {
        permission[key] = payloadValue;
      }
    }

    await this.save(permission);

    return permission;
  }

  mapResponse(payload: Permission): PermissionResponseDto {
    return payload;
  }
}
