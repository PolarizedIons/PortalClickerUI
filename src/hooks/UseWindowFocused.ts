import { useEffect, useState } from 'react';

export const useWindowFocused = () => {
  const [focused, setFocused] = useState(() => document.hasFocus());

  useEffect(() => {
    const handler = () => setFocused(document.hasFocus());

    document.addEventListener('focus', handler);
    document.addEventListener('blur', handler);

    return () => {
      document.removeEventListener('focus', handler);
      document.removeEventListener('blur', handler);
    };
  }, []);
  return focused;
};
