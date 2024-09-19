import { BaseEntity, IFetchResponse } from './base.entity';

export interface IStream extends BaseEntity {
  title: string;
  description: string;
  hls_url: string;
  stream_id: string;
  is_publishing: boolean;
  published_at: Date;
  stopped_at: Date;
  guidance_command: string;
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
