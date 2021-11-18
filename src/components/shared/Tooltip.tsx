import {
  FC, ReactElement, Ref, useEffect, useRef, useState,
} from 'react';
import { Portal } from './Portal';

type TooltipProps = {
    text: string | ReactElement;
    children: (ref: Ref<any>) => ReactElement;
}

const isContainedIn = (aabb: DOMRect, x: number, y: number) => (aabb.x) < x && x < ((aabb.x) + (aabb.width)) && (aabb.y) < y && y < ((aabb.y) + (aabb.height));

export const Tooltip: FC<TooltipProps> = (props) => {
  const { text, children } = props;
  const [transform, setTransform] = useState('translateX(0) translateY(0)');
  const [display, setDisplay] = useState('none');
  const targetRef = useRef<HTMLElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = targetRef.current;

    if (!el) {
      return () => ({});
    }

    const setPos = (event: MouseEvent) => {
      const elAABB = el?.getBoundingClientRect();
      if (!isContainedIn(elAABB, event.x, event.y)) {
        setTransform('');
        setDisplay('none');
      } else {
        const tooltipAABB = tooltipRef.current?.getBoundingClientRect();
        const tooltipWidth = (tooltipAABB?.width ?? 0);
        const tooltipHeight = (tooltipAABB?.height ?? 0);
        const bodyAABB = document.body.getBoundingClientRect();
        const innerWidth = Math.min(bodyAABB.width, window.innerWidth);
        const innerHeight = Math.min(window.innerHeight, bodyAABB.height);

        const x = event.x + 10 + tooltipWidth > innerWidth ? event.x - ((event.x + tooltipWidth) - innerWidth) : event.x + 10;
        const y = event.y + 10 + tooltipHeight > innerHeight ? event.y - ((event.y + tooltipHeight) - innerHeight) : event.y + 10;
        setTransform(`translateX(${x}px) translateY(${y}px)`);
        setDisplay('');
      }
    };

    document.addEventListener('mousemove', setPos);

    return () => {
      document.removeEventListener('mousemove', setPos);
    };
  }, []);

  return (
    <>
      {children(targetRef)}
      <Portal elClassName="tooltip-root">
        <div ref={tooltipRef} className="fixed top-0 left-0 px-4 py-2 rounded-md bg-background-dark bg-opacity-90 text-white z-50" style={{ display, transform, willChange: 'transform' }}>{text}</div>
      </Portal>
    </>
  );
};
