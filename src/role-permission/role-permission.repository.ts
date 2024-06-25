import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RolePermission } from './role-permission.entity';
import { Injectable } from '@nestjs/common';
import { CreateRolePermissionDto } from './dto/create-role-permission.dto';

@Injectable()
export class RolePermissionRepository extends Repository<RolePermission> {
  constructor(
    @InjectRepository(RolePermission)
    protected repository: Repository<RolePermission>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  async insertRecord(
    payload: CreateRolePermissionDto,
  ): Promise<RolePermission> {
    const newRolePermission = await this.create(payload);

    return await this.save(newRolePermission);
  }
}
