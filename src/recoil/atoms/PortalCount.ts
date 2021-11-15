import { atom } from 'recoil';
import { PlayerResponse } from '../../models/responses/PlayerResponse';

export const PlayerState = atom<PlayerResponse | null>({
  key: 'playerState',
  default: null,
});
