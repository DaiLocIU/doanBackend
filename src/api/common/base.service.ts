import { DocumentType } from '@typegoose/typegoose';
import { CreateQuery, UpdateQuery } from 'mongoose';
import { BaseRepository } from './base.repository';
import { BaseModel } from './base.model';

export abstract class BaseService<TModel extends BaseModel> {
  private repository: BaseRepository<TModel>;

  protected constructor(repository: BaseRepository<TModel>) {
    this.repository = repository;
  }

  createModel(doc?: Partial<TModel>): TModel {
    return this.repository.createModel(doc);
  }

  async create(item: CreateQuery<TModel>): Promise<DocumentType<TModel>> {
    return await this.repository.create(item);
  }

  async updateBy(id: string, updateQuery: UpdateQuery<DocumentType<TModel>>)
  :Promise<DocumentType<TModel>> {
    return await this.repository.updateById(id, updateQuery as any).exec();
  }
}
