import { Controller } from '@nestjs/common';
import { AuthBaseController } from 'src/common/controller/auth-base.controller';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { ListPermissionQuery } from './dto/list-permission-query.dto';
import { PermissionResponseDto } from './dto/permission-response.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { Permission } from './permission.entity';
import { PermissionRouter } from './permission.router';
import { PermissionService } from './permission.service';
import { PermissionRepository } from './permission.repository';

@Controller(PermissionRouter.ROOT)
export class PermissionController extends AuthBaseController<
  Permission,
  CreatePermissionDto,
  UpdatePermissionDto,
  ListPermissionQuery,
  PermissionResponseDto,
  PermissionRepository,
  PermissionService
> {
  constructor(
    private permissionService: PermissionService,
    private i18n: I18nCustomService,
  ) {
    super(permissionService, i18n, {
      CreateDto: new CreatePermissionDto(),
      UpdateDto: new UpdatePermissionDto(),
      QueryDto: new ListPermissionQuery(),
    });
  }
}
