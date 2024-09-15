import { BaseEntity, IFetchResponse } from './base.entity';

export interface IFile extends BaseEntity {
  feat: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  mimeType: string;
  refId: string;
  url: string;
}

export interface FetchFilesResponse extends IFetchResponse<IFile> {}
