import { FC, KeyboardEvent, useCallback } from 'react';

type InputProps = {
    value: string;
    type?: string;
    placeholder?: string;
    onEnter?: () => void;
    onChange: (value: string) => void;
}

export const Input: FC<InputProps> = (props) => {
  const {
    value, type = 'text', placeholder, onChange, onEnter,
  } = props;

  const onKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && onEnter) {
      onEnter();
    }
  }, [onEnter]);

  return (
    <div className="w-full">
      <input onKeyDown={onKeyDown} placeholder={placeholder} type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-background-light text-white w-full px-4 py-2 my-1" />
    </div>
  );
};
