import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOneOptions, Repository } from 'typeorm';

@Injectable()
export abstract class BaseRepository<E, C, U, R> extends Repository<E> {
  constructor(
    @InjectRepository(EntityManager)
    protected repository: Repository<E>,
    private relations: string[],
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }

  abstract insertRecord(payload: C): Promise<E>;

  abstract updateRecord(payload: U & { id: string }): Promise<E>;

  abstract mapResponse(payload: E): R;

  getRelations(): string[] {
    return this.relations;
  }

  async findAndThrowError(
    data: {
      message?: string;
      checkExist?: boolean;
    },
    options?: FindOneOptions<E>,
  ): Promise<E> {
    const { message, checkExist } = data;

    const record = await this.findOne(options);

    if (record && checkExist) {
      throw new BadRequestException(message ?? 'Record exist');
    } else if (!record && !checkExist) {
      throw new NotFoundException(message ?? 'Record not found');
    }

    return record;
  }
}
