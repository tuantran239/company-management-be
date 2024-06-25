import { Injectable } from '@nestjs/common';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { BaseRepository } from '../repository/base.repository';

@Injectable()
export abstract class BaseService<
  E,
  C,
  U,
  Q,
  R,
  CR extends BaseRepository<E, C, U, R>,
> {
  constructor(
    private readonly repository: CR,
    protected entityName: string,
    public subject: string
  ) {
    this.entityName = entityName;
    this.subject = subject;
  }

  async create(payload: C): Promise<E> {
    return await this.repository.insertRecord(payload);
  }

  async update(id: string, payload: U): Promise<E> {
    return await this.repository.updateRecord({ ...payload, id });
  }

  async delete(id: string): Promise<E> {
    const record = await this.repository.findAndThrowError(
      { message: `${this.entityName} not found` },
      { where: { id } } as any,
    );

    await this.repository.delete({ id } as any);

    return record as E;
  }

  async remove(id: string): Promise<E> {
    const record = await this.repository.findAndThrowError(
      { message: `${this.entityName} not found` },
      { where: { id } } as any,
    );

    await this.repository.update(
      { id } as any,
      { deleted_at: new Date() } as any,
    );

    return record;
  }

  async listRecord(
    options: FindManyOptions<E>,
  ): Promise<{ records: E[]; total: number }> {
    const data = await this.repository.findAndCount(options);

    return { records: data[0], total: data[1] };
  }

  async retrieveRecord(options: FindOneOptions<E>): Promise<E> {
    return await this.repository.findOne(options);
  }

  mapResponse(entity: E): R {
    return this.repository.mapResponse(entity);
  }

  getRelations(): string[] {
    return this.repository.getRelations();
  }

  abstract list(query: Q): Promise<{ records: E[]; total: number }>;

  abstract retrieve(options: FindOneOptions<E>): Promise<E>;
}
