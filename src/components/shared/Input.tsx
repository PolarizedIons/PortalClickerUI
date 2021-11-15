import { FC } from 'react';

type InputProps = {
    value: string;
    type?: string;
    onChange: (value: string) => void;
}

export const Input: FC<InputProps> = (props) => {
  const { value, type = 'text', onChange } = props;

  return (
    <div>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="bg-background-light text-white w-full px-4 py-2 my-1" />
    </div>
  );
};
