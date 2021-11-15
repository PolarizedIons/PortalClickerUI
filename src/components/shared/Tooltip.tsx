import {
  FC, ReactElement, Ref, useEffect, useRef, useState,
} from 'react';
import { Portal } from './Portal';

type TooltipProps = {
    text: string | ReactElement;
    children: (ref: Ref<any>) => ReactElement;
}

export const Tooltip: FC<TooltipProps> = (props) => {
  const { text, children } = props;
  const [hover, setHover] = useState(false);
  const [transform, setTransform] = useState('translateX(0) translateY(0)');
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const enter = () => setHover(true);
    const leave = () => setHover(false);

    const el = ref.current;
    el?.addEventListener('mouseenter', enter);
    el?.addEventListener('mouseleave', leave);

    return () => {
      el?.removeEventListener('mouseenter', enter);
      el?.removeEventListener('mouseleave', leave);
    };
  },
  []);

  useEffect(() => {
    const el = ref.current;

    if (!el) {
      return () => ({});
    }

    const setPos = (event: MouseEvent) => setTransform(`translateX(${event.x + 10}px) translateY(${event.y + 10}px)`);

    if (hover) {
      el?.addEventListener('mousemove', setPos);
    } else {
      setTransform('scale(0)');
      el?.removeEventListener('mousemove', setPos);
    }

    return () => {
      el.removeEventListener('mousemove', setPos);
    };
  }, [hover]);

  return (
    <>
      {children(ref)}
      <Portal elClassName="tooltip-root">
        <div className={`absolute top-0 left-0 px-4 py-2 rounded-md bg-background-dark bg-opacity-90 text-white z-50 transition-opacity duration-300 ${hover ? 'opacity-100' : 'opacity-0'}`} style={{ transform, willChange: 'transform' }}>{text}</div>
      </Portal>
    </>
  );
};
