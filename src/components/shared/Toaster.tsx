import {
  createContext, FC, useCallback, useContext, useMemo, useRef, useState,
} from 'react';
import { animated, useTransition } from 'react-spring';
import { Portal } from './Portal';

export type Toast = {
    message: string;
    duration?: number;
}

type ToastInternal = Toast & {
    id: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-console
export const ToastContext = createContext((message: Toast) => console.warn('no toast context provider used!'));

export const ToastProvider: FC = (props) => {
  const { children } = props;
  const [toasts, setToasts] = useState<ToastInternal[]>([]);
  const refMap = useMemo(() => new WeakMap(), []);
  const idCounter = useRef(0);

  const addToast = useCallback((toast: Toast) => {
    setToasts((prev) => {
      idCounter.current += 1;
      return [...prev, { ...toast, id: idCounter.current }];
    });
  }, []);

  // https://codesandbox.io/s/github/pmndrs/react-spring/tree/master/demo/src/sandboxes/notification-hub?file=/src/App.tsx:1353-1464
  const transitions = useTransition(toasts, {
    keys: (toast) => toast.id,
    from: { opacity: 0, height: 0, life: '100%' },
    enter: (item) => async (next) => {
      await next({ opacity: 1, height: refMap.get(item).offsetHeight });
      await next({ life: '0%' });
    },
    leave: [{ opacity: 0 }, { height: 0 }],
    onRest: (result, ctrl, item) => {
      setToasts((prev) => prev.filter((i) => i.id !== item.id));
      refMap.delete(item);
    },
    config: (item, index, phase) => (key) => (phase === 'enter' && key === 'life' ? { duration: item.duration ?? 3000 } : { precision: 0.1 }),
  });

  return (
    <ToastContext.Provider value={addToast}>
      {children}

      <Portal elClassName="toasts">
        <div className="fixed top-0 right-0 pr-4 pt-4 flex flex-col-reverse gap-y-4">
          {transitions((style, item) => (
            <animated.div
              key={item.id}
              style={style}
            >
              <animated.div
                className="bg-portal-blue px-6 py-4 font-semibold text-white box-border relative overflow-hidden text-right w-80"
                ref={(ref: HTMLDivElement) => ref && refMap.set(item, ref)}
              >
                {item.message}
              </animated.div>
            </animated.div>
          ))}
        </div>
      </Portal>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
