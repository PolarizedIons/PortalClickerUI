import {
  FC, useEffect, useState,
} from 'react';
import ReactDOM from 'react-dom';

type PortalProps = {
  elClassName: string;
  elType?: string;
}

const getEl = (elClassName: string, elType: string) => {
  let el = document.getElementsByClassName(elClassName)?.[0];
  if (el) {
    return el;
  }
  el = document.createElement(elType);
  el.classList.add(elClassName);
  document.body.appendChild(el);
  return el;
};

export const Portal: FC<PortalProps> = (props) => {
  const { elClassName, elType = 'div', children } = props;
  const [container, setContainer] = useState(getEl(elClassName, elType));

  useEffect(() => {
    if (!container) {
      setContainer(getEl(elClassName, elType));
    }

    return () => {
      const el = document.getElementsByClassName(elClassName)?.[0];
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, [container, elClassName, elType]);

  return ReactDOM.createPortal(children, container);
};
