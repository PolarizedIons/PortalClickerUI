import { atom } from 'recoil';
import { LoginResponse } from '../../models/responses/LoginResponse';

const localDefault = localStorage.getItem('user');

export const UserState = atom<LoginResponse | undefined>({
  key: 'userState',
  default: localDefault ? JSON.parse(localDefault) : undefined,
});
