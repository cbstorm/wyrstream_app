import { atom } from 'recoil';
import { IUser } from '../entities/user.enity';

export const userStateDefault: IUser = {
  _id: '',
  name: '',
  email: '',
  createdAt: null!,
  updatedAt: null!,
};

export const UserState = atom<IUser>({
  key: 'USER_STATE',
  default: userStateDefault,
});
