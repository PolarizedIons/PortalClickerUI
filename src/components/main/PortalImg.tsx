import {
  FC, useCallback, useEffect, useMemo, useRef, useState,
} from 'react';
import { useSetRecoilState } from 'recoil';
import { PlayerState } from '../../recoil/atoms/PortalCount';
import { SignalR } from '../../SignalR';
import portalImg from '../../assets/portal.png';
import { EventSystem } from '../../event-system/EventSystem';
import { useWindowFocused } from '../../hooks/UseWindowFocused';
import { useToast } from '../shared/Toaster';

const sounds: Promise<HTMLAudioElement>[] = [];
const failedSounds: Promise<HTMLAudioElement>[] = [];
for (let i = 0; i < 6; i += 1) {
  sounds.push(import(`../../assets/click${i}.mp3`).then((res) => {
    const sound = new Audio(res.default);
    sound.volume = 0.1;
    return sound;
  }));
}
for (let i = 0; i < 3; i += 1) {
  failedSounds.push(import(`../../assets/fizzle${i}.mp3`).then((res) => {
    const sound = new Audio(res.default);
    sound.volume = 0.05;
    return sound;
  }));
}

export const PortalImg: FC<{lostConnection: boolean}> = (props) => {
  const { lostConnection } = props;
  const setPlayer = useSetRecoilState(PlayerState);
  const [animatePortal, setAnimatePortal] = useState(0);
  const clickCounterRef = useRef(0);
  const focused = useWindowFocused();
  const addToast = useToast();

  const portalClick = useCallback(() => {
    clickCounterRef.current += 1;
    EventSystem.fireEvent('PortalClicked', undefined);

    const library = lostConnection ? failedSounds : sounds;
    library[Math.floor(Math.random() * library.length)].then((sound) => {
      sound.fastSeek(0);
      sound.play();
    });

    setAnimatePortal((prev) => prev + 1);
    setTimeout(() => {
      setAnimatePortal((prev) => prev - 1);
    }, 150);
  }, [lostConnection]);

  useEffect(() => {
    const clickTicker = setInterval(() => {
      const amount = clickCounterRef.current;
      clickCounterRef.current -= amount;

      if (amount > 0) {
        SignalR.invoke('Click', amount)
          .then((count: number) => {
            setPlayer((prev) => prev && ({ ...prev, portalCount: count }));
          })
          .catch((err) => {
            addToast({ message: err?.response?.data ?? 'Unable to register click' });
          });
      }
    }, focused ? 500 : 10000);

    return () => clearInterval(clickTicker);
  }, [addToast, focused, setPlayer]);

  const background = useMemo(() => (animatePortal ? '#ff6a00' : '#00adef'), [animatePortal]);

  return (
    <div>
      <img style={{ background, transition: 'transform cubic-bezier(0.4, 0, 0.2, 1) 300ms, background-color cubic-bezier(0.4, 0, 0.2, 1) 1s' }} src={portalImg} onClick={portalClick} className={`cursor-pointer transform ${animatePortal > 0 ? 'scale-105' : 'scale-100'}`} />
    </div>
  );
};
