import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseRepository } from 'src/common/repository/base.repository';
import { Repository } from 'typeorm';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleResponseDto } from './dto/role-response.dto';

export const ROLE_RELATIONS = ['permissions']

@Injectable()
export class RoleRepository extends BaseRepository<
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  RoleResponseDto
> {
  constructor(
    @InjectRepository(Role)
    protected repository: Repository<Role>,
  ) {
    super(repository, ROLE_RELATIONS);
  }

  async insertRecord(payload: CreateRoleDto): Promise<Role> {
    payload.permissionsId = undefined;

    const newRole = await this.create(payload);

    return await this.save(newRole);
  }

  async updateRecord(payload: UpdateRoleDto & { id: string }): Promise<Role> {
    const { id } = payload;

    payload.permissionsId = undefined;

    const role = await this.findAndThrowError({}, { where: { id } });

    const keysPayload = Object.keys(payload);

    for (let i = 0; i < keysPayload.length; i++) {
      const key = keysPayload[i];

      const payloadValue = payload[key];

      const roleValue = role[key];

      if (roleValue !== undefined && roleValue !== payloadValue) {
        role[key] = payloadValue;
      }
    }

    await this.save(role);

    return role;
  }

  mapResponse(payload: Role): RoleResponseDto {
    return payload;
  }
}
