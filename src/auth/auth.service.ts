import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { RoleManagerDataInit } from 'src/role/role.data';
import { RoleService } from 'src/role/role.service';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private i18n: I18nCustomService,
  ) {}

  async hashPassword() {}

  async login(payload: LoginDto): Promise<UserResponseDto> {
    const { username, password } = payload;

    const user = await this.userService.retrieveRecord({
      where: [{ email: username }, { username }],
      relations: this.userService.getRelations()
    });

    if (!user) {
      throw new BadRequestException(
        this.i18n.getMessage('errors.auth.username_email_not_match'),
      );
    }

    const isMatchPassword = await bcrypt.compare(password, user.password);

    if (!isMatchPassword) {
      throw new BadRequestException(
        this.i18n.getMessage('errors.auth.password_not_match'),
      );
    }

    return this.userService.mapResponse(user);
  }

  async register(payload: RegisterDto): Promise<User> {
    const { username, password, email, isManager } = payload;

    const userEmail = await this.userService.retrieveRecord({
      where: { email },
    });

    if (userEmail) {
      throw new BadRequestException(
        this.i18n.getMessage('errors.auth.email_exists'),
      );
    }

    const userUsername = await this.userService.retrieveRecord({
      where: { username },
    });

    if (userUsername) {
      throw new BadRequestException(
        this.i18n.getMessage('errors.auth.username_exists'),
      );
    }

    if (isManager) {
      const roleManager = await this.roleService.retrieve({
        where: { code: RoleManagerDataInit.code },
      });

      if (roleManager) {
        payload.roleId = roleManager.id;

        const newUser = await this.userService.create(payload);

        return newUser;
      }
    }

    const newUser = await this.userService.create(payload);

    return newUser;
  }
}
