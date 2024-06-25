import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RoleManagerDataInit } from 'src/role/role.data';
import { Role } from 'src/role/role.entity';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CHECK_ABILITY, RequiredRule } from '../decorator/abilities.decorator';
import { checkEnumTypeValid } from '../utils/validate';
import {
  PermissionAction,
  PermissionSubject,
} from 'src/permission/permission.type';
import { EntitiesDatabase } from '../types/status';
import { convertUrlToSubject } from '../utils/convert';
import { Request } from 'express';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class RolePermissionGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private databaseService: DatabaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRule = this.reflector.getAllAndOverride<RequiredRule>(
      CHECK_ABILITY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRule) {
      return true;
    }

    const req = context.switchToHttp().getRequest() as Request;

    const user = context.switchToHttp().getRequest().user as UserResponseDto;

    const userRole = user.role as Role;

    const userPermissions = [...user.permissions];

    if (userRole.code === RoleManagerDataInit.code) {
      return true;
    }

    const subjectFromUrl = convertUrlToSubject(req.url as string);

    if (!checkEnumTypeValid(PermissionSubject, [subjectFromUrl], null, true)) {
      checkEnumTypeValid(EntitiesDatabase, [subjectFromUrl]);
    }

    requiredRule.subject = requiredRule.subject
      ? requiredRule.subject
      : subjectFromUrl;

    const permissionManagerSubject = userPermissions.find(
      (userPermission) =>
        userPermission.subject === requiredRule.subject &&
        userPermission.action === PermissionAction.MANAGER,
    );

    const userSubject = await this.databaseService.getSubjectUser(
      subjectFromUrl,
      {
        id: req.params.id as string,
      },
    );

    const { roleRepository } = this.databaseService.getRepositories();

    if (permissionManagerSubject) {
      if (requiredRule.conditions) {
        const { createdBy, checkRoleManager } = requiredRule.conditions;

        if (checkRoleManager && req.body.roleId) {
          const role = await roleRepository.findOne({
            where: { id: req.body.roleId },
            relations: roleRepository.getRelations(),
          });
          if (!role) {
            throw new ForbiddenException('Access denied');
          } else {
            const isRoleManager = role.permissions.find(
              (permission) => permission.action === PermissionAction.MANAGER,
            );
            if (isRoleManager) {
              throw new ForbiddenException('Access denied');
            }
          }
        }

        if (createdBy && req.params.id) {
          if (!userSubject) {
            throw new ForbiddenException('Access denied');
          } else {
            if (
              userSubject.id !== user.id &&
              userSubject.managerId !== user.id
            ) {
              throw new ForbiddenException('Access denied');
            }
          }
        }
      }

      return true;
    }

    const permissionMatch = userPermissions.find(
      (userPermission) =>
        userPermission.subject === requiredRule.subject &&
        userPermission.action === requiredRule.action &&
        userPermission.code === requiredRule.code,
    );

    if (!permissionMatch) {
      throw new ForbiddenException('Access denied');
    }

    if (requiredRule.conditions) {
      const { createdBy, checkRoleManager } = requiredRule.conditions;

      if (checkRoleManager && req.body.roleId) {
        const role = await roleRepository.findOne({
          where: { id: req.body.roleId },
          relations: roleRepository.getRelations(),
        });
        if (!role) {
          throw new ForbiddenException('Access denied');
        } else {
          const isRoleManager = role.permissions.find(
            (permission) => permission.action === PermissionAction.MANAGER,
          );
          if (isRoleManager) {
            throw new ForbiddenException('Access denied');
          }
        }
      }

      if (createdBy && req.params.id) {
        if (!userSubject) {
          throw new ForbiddenException('Access denied');
        } else {
          if (userSubject.id !== user.id && userSubject.managerId !== user.id) {
            throw new ForbiddenException('Access denied');
          }
        }
      }
    }

    return true;
  }
}
