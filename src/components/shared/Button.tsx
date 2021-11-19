import { FC } from 'react';

type ButtonProps = {
    onClick: () => void;
    outlined?: boolean;
}

export const Button:FC<ButtonProps> = (props) => {
  const { onClick, outlined, children } = props;

  return (
    <div onClick={onClick} className={`border-2 border-portal-blue ${outlined ? 'bg-background-dark' : 'bg-portal-blue'} py-2 px-4 max-w-max cursor-pointer  transition-transform transform hover:scale-105`}>{children}</div>
  );
};
