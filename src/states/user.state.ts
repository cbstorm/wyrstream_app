import { atom } from 'recoil';
import { IUser } from '../entities/user.enity';

const userStateDefault: IUser = {
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
