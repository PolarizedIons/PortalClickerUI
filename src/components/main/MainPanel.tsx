import { FC, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { useEvent } from '../../hooks/UseEvent';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { ClickerService } from '../../services/ClickerService';
import { LoadingIcon } from '../shared/LoadingIcon';
import { PortalCount } from './PortalCount';
import { PortalImg } from './PortalImg';

export const MainPanel: FC = () => {
  const [player, setPlayer] = useRecoilState(PlayerState);

  useEvent('OnPlayerStatsUpdated', setPlayer);

  useEffect(() => {
    ClickerService.getStats().then((res) => {
      setPlayer(res);
    });
  }, [setPlayer]);

  return (
    <div className="w-3/5 relative flex flex-col">
      {!player ? <LoadingIcon /> : (
        <>
          <PortalCount />
          <div className="flex-grow flex flex-col justify-center items-center">
            <PortalImg />
          </div>
        </>
      )}
    </div>
  );
};
