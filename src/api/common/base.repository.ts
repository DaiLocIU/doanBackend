import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType } from '@typegoose/typegoose';
import { MongoError } from 'mongodb';
import {
  Aggregate,
  CreateQuery,
  DocumentQuery,
  FilterQuery,
  Query,
  QueryFindOneAndUpdateOptions,
  Types,
  UpdateQuery,
} from 'mongoose';
import { ModelType } from '../types/index';
import { BaseModel } from './base.model';

type QueryList<T extends BaseModel> = DocumentQuery<DocumentType<T>[], DocumentType<T>>;
type QueryItem<T extends BaseModel> = DocumentQuery<DocumentType<T>, DocumentType<T>>;

interface QueryOptions {
  lean?: boolean;
  autopopulate?: boolean;
}

export abstract class BaseRepository<T extends BaseModel> {
  protected model: ModelType<T>;

  protected constructor(model: ModelType<T>) {
    this.model = model;
  }

  private static get defaultOptions(): QueryOptions {
    return { lean: true, autopopulate: true };
  }

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  /* eslint-disable-next-line  class-methods-use-this */
  protected getQueryOptions(options?: QueryOptions) {
    const mergedOptions = {
      ...BaseRepository.defaultOptions,
      ...(options || {}),
    };
    const option = mergedOptions.lean ? { virtuals: true } : null;

    if (option && mergedOptions.autopopulate) {
      option.virtuals = true;
    }

    return { lean: option, autopopulate: mergedOptions.autopopulate };
  }

  createModel(doc?: Partial<T>): T {
    /* eslint-disable-next-line new-cap */
    return new this.model(doc);
  }

  findByAggregate(filter: FilterQuery<DocumentType<T>>[] = [{}]):Aggregate<T[]> {
    return this.model.aggregate(filter);
  }

  findAll(options?: QueryOptions): QueryList<T> {
    return this.model.find().setOptions(this.getQueryOptions(options));
  }

  findOne(options?: QueryOptions): QueryItem<T> {
    return this.model.findOne().setOptions(this.getQueryOptions(options));
  }

  findById(id: string, options?: QueryOptions): QueryItem<T> {
    return this.model.findById(Types.ObjectId(id)).setOptions(this.getQueryOptions(options));
  }

  async create(item: CreateQuery<T>): Promise<DocumentType<T>> {
    try {
      return await this.model.create(item);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }

  deleteOne(options?: QueryOptions): QueryItem<T> {
    return this.model.findOneAndDelete().setOptions(this.getQueryOptions(options));
  }

  deleteById(id: string, options?: QueryOptions): QueryItem<T> {
    return this.model.findByIdAndDelete(
      Types.ObjectId(id),
    ).setOptions(this.getQueryOptions(options));
  }

  updateByFilter(
    filter: FilterQuery<DocumentType<T>> = {},
    updateQuery: UpdateQuery<DocumentType<T>>,
    updateOptions: QueryFindOneAndUpdateOptions = {},
    options?: QueryOptions,
  ): QueryItem<T> {
    return this.model
      .findOneAndUpdate(filter, updateQuery, {
        ...({ omitUndefined: true, ...updateOptions }),
        new: true,
      })
      .setOptions(this.getQueryOptions(options));
  }

  update(item: T, options?: QueryOptions): QueryItem<T> {
    return this.updateByFilter(
      { _id: Types.ObjectId(item.id) as any },
      { $set: item } as any,
      {}, options,
    );
  }

  updateById(
    id: string,
    updateQuery: UpdateQuery<DocumentType<T>>,
    updateOptions: QueryFindOneAndUpdateOptions & { multi?: boolean } = {},
    options?: QueryOptions,
  ): QueryItem<T> {
    return this.updateByFilter(
      { _id: Types.ObjectId(id) as any },
      updateQuery,
      updateOptions,
      options,
    );
  }

  count(filter: FilterQuery<DocumentType<T>> = {}): Query<number> {
    return this.model.count(filter);
  }

  async countAsync(filter: FilterQuery<DocumentType<T>> = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }

  async exists(filter: FilterQuery<DocumentType<T>> = {}): Promise<boolean> {
    try {
      return await this.model.exists(filter);
    } catch (e) {
      BaseRepository.throwMongoError(e);
    }
  }
}
