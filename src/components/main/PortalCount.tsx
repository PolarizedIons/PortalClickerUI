import {
  FC, useEffect, useRef, useState,
} from 'react';
import { useRecoilState } from 'recoil';
import { useDebugMode } from '../../hooks/UseDebugMode';
import { useEvent } from '../../hooks/UseEvent';
import { useWindowFocused } from '../../hooks/UseWindowFocused';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { SignalR } from '../../SignalR';
import { formatPortals } from '../../utils/NumberUtils';
import { useToast } from '../shared/Toaster';

export const PortalCount: FC<{lostConnection: boolean}> = (props) => {
  const { lostConnection } = props;
  const [player, setPlayer] = useRecoilState(PlayerState);
  const [displayCount, setDisplayCount] = useState(player?.portalCount ?? 0);
  const displayLastTick = useRef(new Date());
  const [reportTickReset, setReportTickReset] = useState(0);
  const debugMode = useDebugMode();
  const focused = useWindowFocused();
  const addToast = useToast();

  // Ticking
  useEvent('PurchaseMade', () => setReportTickReset((prev) => prev + 1));
  useEffect(() => {
    // *have to* use the varible in the useEffect, just want to reset the ticker whenever we get a purchase
    if (reportTickReset === -69) return () => {};

    let reportLastTick = new Date();
    let prevLeftOver = 0;
    const ticker = setInterval(() => {
      const currentTick = new Date();
      const elapsed = ((currentTick.getTime() - reportLastTick.getTime()) / 1000) + prevLeftOver;
      const flooredElapsed = Math.floor(elapsed);
      prevLeftOver = Math.max(0, elapsed - flooredElapsed);
      reportLastTick = currentTick;

      SignalR.invoke('Tick', flooredElapsed)
        .then((count: number) => {
          setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
        })
        .catch((err) => {
          addToast({ message: err?.response?.data ?? 'Unable to register tick' });
        });
    }, 1000);

    return () => {
      clearInterval(ticker);
    };
  }, [setPlayer, reportTickReset, addToast]);

  // Portal count updated from another instance
  useEvent('OnPortalCountUpdated', (count) => {
    setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
    setDisplayCount(count);
  });

  // updating display count
  useEffect(() => {
    if (lostConnection) {
      return () => {};
    }

    displayLastTick.current = new Date();
    const run = () => {
      const currentTick = new Date();
      const elapsed = (currentTick.getTime() - displayLastTick.current.getTime()) / 1000;
      setDisplayCount((prev) => prev + (player?.portalsPerSecond ?? 0) * elapsed);
      displayLastTick.current = currentTick;
    };
    const ticker = setInterval(() => run(), focused ? 50 : 1000);

    return () => {
      clearInterval(ticker);
      run();
    };
  }, [focused, lostConnection, player?.portalsPerSecond]);

  // Events relating to portals
  useEvent('PortalClicked', () => setDisplayCount((prev) => prev + (player?.baseClickAmount ?? 1)));
  useEvent('PurchaseMade', (cost) => setDisplayCount((prev) => prev - cost));

  return (
    <div className="text-center my-4">
      {lostConnection && (
      <div className="bg-red-500 text-white font-bold px-6 py-4 mb-4 text-xl">
        Connection Lost
      </div>
      )}
      <div className="text-3xl">
        <span className=" font-mono">{debugMode ? Math.floor(displayCount) : formatPortals(displayCount)}</span>
        {' '}
        {debugMode && (
          <span className="text-gray-400 font-mono">
            (
            {player?.portalCount}
            )
          </span>
        )}
        {' '}
        portals placed
      </div>
      <div className="text-xl">
        <span className="font-mono">{debugMode ? player?.portalsPerSecond : formatPortals(player?.portalsPerSecond ?? 0)}</span>
        {' '}
        portals per second
        {debugMode && (
        <div className="text-gray-400">
          <div>
            <span className="font-mono">{player?.baseClickAmount}</span>
            x
            {' '}
            base click
          </div>
          <div>
            <span className="font-mono">{Math.floor((player?.clickMultiplier ?? 0) * 100) / 100}</span>
            x
            {' '}
            click multiplier
          </div>
          <div>
            <span className="font-mono">{Math.floor((player?.itemPortalMultiplier ?? 0) * 1000) / 1000}</span>
            x
            {' '}
            item portal multiplier
          </div>
          <div>
            <span className="font-mono">{Math.floor((player?.itemPriceMultiplier ?? 0) * 1000) / 100}</span>
            x
            {' '}
            item price multiplier
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
