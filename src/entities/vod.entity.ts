import { BaseEntity, IFetchResponse } from './base.entity';

export interface IVod extends BaseEntity {
  owner_id: string;
  title: string;
  description: string;
  hls_url: string;
  thumbnail_url: string;
}

export interface IUpdateVodInput {}

export interface FetchVodsResponse extends IFetchResponse<IVod> {}
