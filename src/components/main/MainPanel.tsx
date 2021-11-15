import {
  FC, useCallback, useEffect, useRef, useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { useEvent } from '../../hooks/UseEvent';
import portalImg from '../../assets/portal.png';
import { SignalR } from '../../SignalR';
import { PlayerResponse } from '../../models/responses/PlayerResponse';
import { PlayerState } from '../../recoil/atoms/PortalCount';

export const MainPanel: FC = () => {
  const [player, setPlayer] = useRecoilState(PlayerState);
  const [animatePortal, setAnimatePortal] = useState(0);
  const tickRef = useRef<number>(0);

  useEffect(() => {
    let lastTick = new Date();
    tickRef.current = setInterval(() => {
      const currentTick = new Date();
      SignalR.invoke('Tick', Math.floor((currentTick.getTime() - lastTick.getTime()) / 1000)).then((count: number) => {
        setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
      });
      lastTick = currentTick;
    }, 5000) as unknown as number;

    return () => {
      clearInterval(tickRef.current);
    };
  }, [setPlayer]);

  useEffect(() => {
    SignalR.invoke('GetStats').then((res: PlayerResponse) => {
      setPlayer(res);
    });
  }, [setPlayer]);

  useEvent('OnPortalCountUpdated', (count) => setPlayer((prev) => prev && ({ ...prev, portalCount: count })));

  const portalClick = useCallback(() => {
    setAnimatePortal((prev) => prev + 1);
    setTimeout(() => {
      setAnimatePortal((prev) => prev - 1);
    }, 150);

    SignalR.invoke('click').then((count: number) => {
      setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
    });
  }, [setPlayer]);

  return (
    <div className="w-3/5">
      <div>
        portals:
        {' '}
        {player?.portalCount}

      </div>
      <div>
        portals/sec:
        {' '}
        {player?.portalsPerSecond}
      </div>

      <img src={portalImg} onClick={portalClick} className={`cursor-pointer transition-transform  transform duration-300 ${animatePortal > 0 ? 'scale-105' : 'scale-100'}`} />
    </div>
  );
};
