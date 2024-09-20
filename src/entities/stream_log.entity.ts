import { BaseEntity, IFetchResponse } from './base.entity';

export interface IStreamLog extends BaseEntity {
  stream_obj_id: string;
  log: string;
}

export interface FetchStream_logsResponse extends IFetchResponse<IStreamLog> {}
