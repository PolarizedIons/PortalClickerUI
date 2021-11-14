import { atom } from 'recoil';

export const LoggedInState = atom<boolean>({
  key: 'loggedInState',
  default: false,
});
