export interface IFetchResponse<T> {
  result: T[];
  total: number;
}
export interface BaseEntity {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
}
