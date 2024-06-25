import { Injectable } from '@nestjs/common';
import { BaseService } from 'src/common/service/base.service';
import { I18nCustomService } from 'src/i18n-custom/i18n-custom.service';
import { FindOneOptions, FindOptionsWhere, ILike } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ListUserQuery } from './dto/list-user-query.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import { PermissionSubject } from 'src/permission/permission.type';

@Injectable()
export class UserService extends BaseService<
  User,
  CreateUserDto,
  UpdateUserDto,
  ListUserQuery,
  UserResponseDto,
  UserRepository
> {
  constructor(
    private readonly userRepository: UserRepository,
    private i18n: I18nCustomService,
  ) {
    super(userRepository, 'User', PermissionSubject.USER);
  }

  async list(
    query: ListUserQuery,
  ): Promise<{ records: UserResponseDto[]; total: number }> {
    const { page, pageSize, search } = query;

    const where: FindOptionsWhere<User>[] = [];

    if (search && search.trim().length > 0) {
      if (search.includes('@')) {
        where.push({
          email: ILike(search),
        });
      } else {
        where.push({
          username: ILike(search),
        });
      }
    }

    const userResponseData = await this.userRepository.findAndCount({
      where,
      skip: page,
      take: pageSize,
    });

    const records = userResponseData[0].map((record) =>
      this.userRepository.mapResponse(record),
    );

    return { records, total: userResponseData[1] };
  }

  async retrieve(options: FindOneOptions<User>): Promise<UserResponseDto> {

    const user = await this.userRepository.findAndThrowError(
      {
        message: this.i18n.getMessage('errors.common.not_found', {
          args: [{ entity: this.entityName }],
        }),
      },
      { ...options, relations: this.userRepository.getRelations() },
    );

    return this.userRepository.mapResponse(user);
  }
}
