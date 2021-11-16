import { FC, useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { useEvent } from '../../hooks/UseEvent';
import { useWindowFocused } from '../../hooks/UseWindowFocused';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { SignalR } from '../../SignalR';

export const PortalCount: FC = () => {
  const [player, setPlayer] = useRecoilState(PlayerState);
  const [displayCount, setDisplayCount] = useState(player?.portalCount ?? 0);
  const focused = useWindowFocused();

  // Ticking
  useEffect(() => {
    let lastTick = new Date();
    let prevLeftOver = 0;
    const ticker = setInterval(() => {
      const currentTick = new Date();
      const elapsed = ((currentTick.getTime() - lastTick.getTime()) / 1000) + prevLeftOver;
      const flooredElapsed = Math.floor(elapsed);
      prevLeftOver = Math.max(0, elapsed - flooredElapsed);
      lastTick = currentTick;

      SignalR.invoke('Tick', flooredElapsed).then((count: number) => {
        setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
      });
    }, 5000);

    return () => {
      clearInterval(ticker);
    };
  }, [setPlayer]);

  // Portal count updated from another instance
  useEvent('OnPortalCountUpdated', (count) => {
    setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
    setDisplayCount(count);
  });

  // updating display count
  useEffect(() => {
    let lastTick = new Date();
    const run = () => {
      const currentTick = new Date();
      const elapsed = (currentTick.getTime() - lastTick.getTime()) / 1000;
      setDisplayCount((prev) => prev + (player?.portalsPerSecond ?? 0) * elapsed);
      lastTick = currentTick;
    };
    const ticker = setInterval(() => run(), focused ? 50 : 1000);

    return () => {
      clearInterval(ticker);
      run();
    };
  }, [focused, player?.portalsPerSecond]);

  // Events relating to portals
  useEvent('PortalClicked', () => setDisplayCount((prev) => prev + (player?.baseClickAmount ?? 1)));
  useEvent('PurchaseMade', (cost) => setDisplayCount((prev) => prev - cost));

  return (
    <div className="text-center my-4">
      <div className="text-3xl">
        {Math.floor(displayCount)}
        {' '}
        portals placed
      </div>
      <div className="text-xl">
        {player?.portalsPerSecond}
        {' '}
        portals per second
      </div>

    </div>
  );
};
