import { BaseEntity, IFetchResponse } from './base.entity';

export interface IStream extends BaseEntity {
  title: string;
  description: string;
}

export interface ICreateStreamInput {
  title: string;
  description: string;
}

export interface IUpdateStreamInput {
  title: string;
  description: string;
}

export interface FetchStreamsResponse extends IFetchResponse<IStream> {}
