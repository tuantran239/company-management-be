import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Post,
  Put,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { BaseRouterUrl } from '../constant/router';
import { BaseService } from '../service/base.service';
import { ResponseData } from '../types';
import { checkBodyValid } from '../utils/validate';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { BaseRepository } from '../repository/base.repository';
import { RolePermissionGuard } from '../guard/role-permission.guard';
import { CheckAbilities } from '../decorator/abilities.decorator';
import {
  PermissionAction,
  PermissionCodeDefault,
} from 'src/permission/permission.type';
import { User } from 'src/user/user.entity';

@Controller()
export class AuthBaseController<
  E,
  C,
  U,
  Q,
  R,
  CR extends BaseRepository<E, C, U, R>,
  S extends BaseService<E, C, U, Q, R, CR>,
> {
  constructor(
    private readonly service: S,
    private readonly _i18n: I18nCustomService,
    private readonly dto: {
      CreateDto: C;
      UpdateDto: U;
      QueryDto: Q;
    },
    private isDeleteDatabase: boolean = false,
  ) {
    this.isDeleteDatabase = isDeleteDatabase;
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.CREATE,
    code: PermissionCodeDefault.CREATE,
    conditions: {
      checkRoleManager: true,
    },
  })
  @Post(BaseRouterUrl.CREATE)
  public async create(
    @Body() payload: C,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await checkBodyValid(this.dto.CreateDto, payload, this._i18n);

      const me = req.user as User;

      const newRecord = await this.service.create({ ...payload, me });

      const responseData: ResponseData = {
        message: 'success',
        data: newRecord,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new BadRequestException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.UPDATE,
    code: PermissionCodeDefault.UPDATE,
    conditions: { createdBy: true, checkRoleManager: true },
  })
  @Put(BaseRouterUrl.UPDATE)
  async update(@Body() payload: U, @Req() req: Request, @Res() res: Response) {
    try {
      await checkBodyValid(this.dto.UpdateDto, payload, this._i18n);

      const me = req.user as User;

      const { id } = req.params;

      const updatedRecord = await this.service.update(id, { ...payload, me });

      const responseData: ResponseData = {
        message: 'success',
        data: updatedRecord,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.READ,
    code: PermissionCodeDefault.LIST,
  })
  @Get(BaseRouterUrl.LIST)
  async list(@Req() req: Request, @Res() res: Response) {
    try {
      await checkBodyValid(this.dto.QueryDto, req.query as Q, this._i18n);

      const query = req.query as Q;

      const data = await this.service.list(query);

      const responseData: ResponseData = {
        message: 'success',
        data,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.READ,
    code: PermissionCodeDefault.RETRIEVE,
    conditions: { createdBy: true },
  })
  @Get(BaseRouterUrl.RETRIEVE)
  async retrieveById(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;

      const options = { where: { id } } as any;

      const record = await this.service.retrieve(options);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.UPDATE,
    code: PermissionCodeDefault.REMOVE,
    conditions: { createdBy: true },
  })
  @Put(BaseRouterUrl.REMOVE)
  async remove(@Req() req: Request, @Res() res: Response) {
    try {
      const { id } = req.params;

      const record = await this.service.remove(id);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }

  @UseGuards(JwtAuthGuard, RolePermissionGuard)
  @CheckAbilities({
    action: PermissionAction.DELETE,
    code: PermissionCodeDefault.DELETE,
    conditions: { createdBy: true },
  })
  @Delete(BaseRouterUrl.DELETE)
  async delete(@Req() req: Request, @Res() res: Response) {
    try {
      if (!this.isDeleteDatabase) {
        throw new Error('Method not supported');
      }

      const { id } = req.params;

      const record = await this.service.delete(id);

      const responseData: ResponseData = {
        message: 'success',
        data: record,
        error: null,
        statusCode: 200,
      };

      return res.status(200).send(responseData);
    } catch (error: any) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
