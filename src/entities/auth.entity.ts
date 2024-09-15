import { IUser } from './user.enity';

export interface ILoginInput {
  email: string;
  password: string;
}

export interface ILoginReponse extends IUser {
  access_token: string;
  refresh_token: string;
}

export interface ICreateAccountInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ICreateAccountResponse {
  user: IUser;
}
