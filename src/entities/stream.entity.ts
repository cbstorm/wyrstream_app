import { BaseEntity, IFetchResponse } from './base.entity';
import { IStreamLog } from './stream_log.entity';
import { IUser } from './user.enity';

export interface IStream extends BaseEntity {
  title: string;
  description: string;
  enable_record: boolean;
  hls_url: string;
  stream_id: string;
  is_publishing: boolean;
  published_at: Date;
  stopped_at: Date;
  guidance_command: string;
  thumbnail_url: string;
  ready_for_vod: boolean;
  stream_server_url: string;
  stream_url: string;
  shown_publish_key: string;
  stream_logs: IStreamLog[];
  publisher: IUser;
}

export interface ICreateStreamInput {
  title: string;
  description: string;
  enable_record: boolean;
}

export interface IUpdateStreamInput {
  title: string;
  description: string;
  enable_record: boolean;
}

export interface FetchStreamsResponse extends IFetchResponse<IStream> {}
