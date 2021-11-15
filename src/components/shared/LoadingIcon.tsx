import { FC } from 'react';

export const LoadingIcon: FC = () => (
  <div className="absolute top-0 bottom-0 left-0 right-0 bg-black bg-opacity-20">
    <div className="w-full h-full flex justify-center items-center">
      <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  </div>
);
