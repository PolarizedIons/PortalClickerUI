import {
  FC, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useSetRecoilState } from 'recoil';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { SignalR } from '../../SignalR';
import portalImg from '../../assets/portal.png';
import { EventSystem } from '../../event-system/EventSystem';
import { useWindowFocused } from '../../hooks/UseWindowFocused';

const sounds: Promise<HTMLAudioElement>[] = [];
// eslint-disable-next-line no-plusplus
for (let i = 0; i < 6; i++) {
  sounds.push(import(`../../assets/click${i}.mp3`).then((res) => {
    const sound = new Audio(res.default);
    sound.volume = 0.1;
    return sound;
  }));
}

export const PortalImg: FC = () => {
  const setPlayer = useSetRecoilState(PlayerState);
  const [animatePortal, setAnimatePortal] = useState(0);
  const clickCounterRef = useRef(0);
  const focused = useWindowFocused();

  const portalClick = useCallback(() => {
    clickCounterRef.current += 1;
    EventSystem.fireEvent('PortalClicked', undefined);

    // eslint-disable-next-line
    sounds[Math.floor(Math.random() * sounds.length)].then((sound) => {
      sound.fastSeek(0);
      sound.play();
    });

    setAnimatePortal((prev) => prev + 1);
    setTimeout(() => {
      setAnimatePortal((prev) => prev - 1);
    }, 150);
  }, []);

  useEffect(() => {
    const clickTicker = setInterval(() => {
      const amount = clickCounterRef.current;
      clickCounterRef.current -= amount;

      if (amount > 0) {
        SignalR.invoke('Click', amount).then((count: number) => {
          setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
        });
      }
    }, focused ? 500 : 10000);

    return () => clearInterval(clickTicker);
  }, [focused, setPlayer]);

  const background = useMemo(() => (animatePortal ? '#ff6a00' : '#00adef'), [animatePortal]);

  return (
    <div>
      <img style={{ background, transition: 'transform cubic-bezier(0.4, 0, 0.2, 1) 300ms, background-color cubic-bezier(0.4, 0, 0.2, 1) 1s' }} src={portalImg} onClick={portalClick} className={`cursor-pointer transform ${animatePortal > 0 ? 'scale-105' : 'scale-100'}`} />
    </div>
  );
};
