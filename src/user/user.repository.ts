import { Injectable } from '@nestjs/common';
import { BaseRepository } from 'src/common/repository/base.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { hashPassword } from 'src/common/utils/hash';

export const USER_RELATIONS = ['role', 'role.permissions'];
@Injectable()
export class UserRepository extends BaseRepository<
  User,
  CreateUserDto,
  UpdateUserDto,
  UserResponseDto
> {
  constructor(
    @InjectRepository(User)
    protected repository: Repository<User>,
    public i18n: I18nCustomService,
  ) {
    super(repository, USER_RELATIONS);
  }

  async insertRecord(payload: CreateUserDto): Promise<User> {
    await this.findAndThrowError(
      {
        message: this.i18n.getMessage('errors.auth.email_exists'),
        checkExist: true,
      },
      { where: { email: payload.email } },
    );

    payload.password = await hashPassword(payload.password);

    if (payload.me) {
      payload.managerId = payload.me.id;
    }

    const newUser = await this.create(payload);

    return await this.save(newUser);
  }

  async updateRecord(payload: UpdateUserDto & { id: string }): Promise<User> {
    const { id } = payload;

    const user = await this.findAndThrowError(
      { message: 'User not found', checkExist: false },
      { where: { id } },
    );

    const keysPayload = Object.keys(payload);

    for (let i = 0; i < keysPayload.length; i++) {
      const key = keysPayload[i];

      const payloadValue = payload[key];

      const userValue = user[key];

      if (userValue && userValue !== payloadValue) {
        if (key === 'password') {
          user[key] = await hashPassword(payloadValue);
        } else {
          user[key] = payloadValue;
        }
      }
    }

    await this.save(user);

    return user;
  }

  mapResponse(payload: User): UserResponseDto {
    const permissions = [...payload.role.permissions];

    payload.role.permissions = [];

    const userResponse: UserResponseDto = {
      ...payload,
      password: undefined,
      role: payload.role,
      permissions,
    } as UserResponseDto;

    return userResponse;
  }
}
