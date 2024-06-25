import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthBaseController } from 'src/common/controller/auth-base.controller';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserQuery } from './dto/list-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { UserRouter } from './user.router';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';

@ApiTags('user')
@Controller(UserRouter.ROOT)
export class UserController extends AuthBaseController<
  User,
  CreateUserDto,
  UpdateUserDto,
  ListUserQuery,
  UserResponseDto,
  UserRepository,
  UserService
> {
  constructor(
    private userService: UserService,
    private i18n: I18nCustomService,
  ) {
    super(userService, i18n, {
      CreateDto: new CreateUserDto(),
      UpdateDto: new UpdateUserDto(),
      QueryDto: new ListUserQuery(),
    });
  }
}
