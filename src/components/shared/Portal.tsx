import {
  FC, useEffect, useState,
} from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  elClassName: string;
}

const getEl = (elClassName: string) => {
  let el = document.getElementsByClassName(elClassName)?.[0];
  if (el) {
    return el;
  }
  el = document.createElement('div');
  el.classList.add(elClassName);
  document.body.appendChild(el);
  return el;
};

export const Portal: FC<PortalProps> = (props) => {
  const { elClassName, children } = props;
  const [container, setContainer] = useState(getEl(elClassName));

  useEffect(() => {
    if (!container) {
      setContainer(getEl(elClassName));
    }

    return () => {
      const el = document.getElementsByClassName(elClassName)?.[0];
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, [container, elClassName]);

  return ReactDOM.createPortal(children, container);
};
