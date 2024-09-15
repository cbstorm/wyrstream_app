import { BaseEntity } from './base.entity';

export interface IUser extends BaseEntity {
  email: string;
  name: string;
  avatarUrl?: string;
  isNoCompany: boolean;
}
