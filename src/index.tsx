import { StrictMode } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import { App } from './App';
import { ToastProvider } from './components/shared/Toaster';
import './index.css';

ReactDOM.render(
  <StrictMode>
    <RecoilRoot>
      <ToastProvider>
        <App />
      </ToastProvider>
    </RecoilRoot>
  </StrictMode>,
  document.getElementById('root'),
);
