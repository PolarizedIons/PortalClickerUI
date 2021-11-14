import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { App } from './App';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root'),
);
