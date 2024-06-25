import { Injectable } from '@nestjs/common';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { PermissionRepository } from 'src/permission/permission.repository';
import { PermissionSubject } from 'src/permission/permission.type';
import { RolePermissionRepository } from 'src/role-permission/role-permission.repository';
import { RoleRepository } from 'src/role/role.repository';
import { UserRepository } from 'src/user/user.repository';
import { DataSource } from 'typeorm';

export interface DataSourceRepository {
  userRepository: UserRepository;
  rolePermissionRepository: RolePermissionRepository;
  roleRepository: RoleRepository;
  permissionRepository: PermissionRepository;
}

@Injectable()
export class DatabaseService {
  private repositories: DataSourceRepository;

  constructor(
    private dataSource: DataSource,
    private readonly userRepository: UserRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private i18n: I18nCustomService,
  ) {
    this.repositories = {
      userRepository: this.userRepository,
      rolePermissionRepository: this.rolePermissionRepository,
      roleRepository: this.roleRepository,
      permissionRepository: this.permissionRepository,
    };
  }

  async runTransaction<T>(
    callback: (repositories: DataSourceRepository) => Promise<T>,
  ) {
    const queryRunner = await this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const repositories: DataSourceRepository = {
      userRepository: queryRunner.manager
        .getRepository(this.userRepository.target)
        .extend({
          insertRecord: this.userRepository.insertRecord,
          updateRecord: this.userRepository.updateRecord,
          mapResponse: this.userRepository.mapResponse,
          findAndThrowError: this.userRepository.findAndThrowError,
          i18n: this.i18n,
        }) as UserRepository,

      rolePermissionRepository: queryRunner.manager
        .getRepository(this.rolePermissionRepository.target)
        .extend({
          insertRecord: this.rolePermissionRepository.insertRecord,
        }) as RolePermissionRepository,

      roleRepository: queryRunner.manager
        .getRepository(this.roleRepository.target)
        .extend({
          insertRecord: this.roleRepository.insertRecord,
          updateRecord: this.roleRepository.updateRecord,
          mapResponse: this.roleRepository.mapResponse,
          findAndThrowError: this.roleRepository.findAndThrowError,
        }) as RoleRepository,

      permissionRepository: queryRunner.manager
        .getRepository(this.permissionRepository.target)
        .extend({
          insertRecord: this.permissionRepository.insertRecord,
          updateRecord: this.permissionRepository.updateRecord,
          mapResponse: this.permissionRepository.mapResponse,
          findAndThrowError: this.permissionRepository.findAndThrowError,
          i18n: this.i18n,
        }) as PermissionRepository,
    };

    try {
      const result = await callback(repositories);
      await queryRunner.commitTransaction();
      return result as T;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error.message);
    } finally {
      await queryRunner.release();
    }
  }

  getRepositories() {
    return this.repositories;
  }

  async getSubjectUser(subject: string, payload: { id: string }) {
    if(subject === PermissionSubject.USER) {
      return await this.getRepositories().userRepository.findOne({ where: { id: payload.id } })
    }
    return null
  }
}
