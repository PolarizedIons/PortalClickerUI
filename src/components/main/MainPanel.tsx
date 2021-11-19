import { FC, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useEvent } from '../../hooks/UseEvent';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { ClickerService } from '../../services/ClickerService';
import { LoadingIcon } from '../shared/LoadingIcon';
import { useToast } from '../shared/Toaster';
import { PortalCount } from './PortalCount';
import { PortalImg } from './PortalImg';

export const MainPanel: FC = () => {
  const [player, setPlayer] = useRecoilState(PlayerState);
  const [lostConnection, setLostConnection] = useState(false);
  const addToast = useToast();

  useEvent('ConnectionLost', () => setLostConnection(true));
  useEvent('ConnectionRestored', () => {
    addToast({ message: 'Connection restored' });
    window.location.reload();
  });

  useEvent('OnPlayerStatsUpdated', setPlayer);

  useEffect(() => {
    ClickerService.getStats()
      .then((res) => {
        setPlayer(res);
      })
      .catch((err) => {
        addToast({ message: err?.response?.data ?? 'Unable to fetch user stats' });
      });
  }, [addToast, setPlayer]);

  return (
    <div id="main-panel" className="w-3/5 relative flex flex-col">
      {!player ? <LoadingIcon /> : (
        <>
          <PortalCount lostConnection={lostConnection} />
          <div className="flex-grow flex flex-col justify-center items-center">
            <PortalImg lostConnection={lostConnection} />
          </div>
        </>
      )}
    </div>
  );
};
