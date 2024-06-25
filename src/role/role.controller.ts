import { Controller } from '@nestjs/common';
import { RoleRouter } from './role.router';
import { BaseController } from 'src/common/controller/base.controller';
import { Role } from './role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ListRoleQuery } from './dto/list-role-query.dto';
import { RoleResponseDto } from './dto/role-response.dto';
import { RoleService } from './role.service';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { AuthBaseController } from 'src/common/controller/auth-base.controller';
import { RoleRepository } from './role.repository';

@Controller(RoleRouter.ROOT)
export class RoleController extends AuthBaseController<
  Role,
  CreateRoleDto,
  UpdateRoleDto,
  ListRoleQuery,
  RoleResponseDto,
  RoleRepository,
  RoleService
> {
  constructor(
    private roleService: RoleService,
    private i18n: I18nCustomService,
  ) {
    super(roleService, i18n, {
      CreateDto: new CreateRoleDto(),
      UpdateDto: new UpdateRoleDto(),
      QueryDto: new ListRoleQuery(),
    });
  }
}
