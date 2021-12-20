import './wdyr.ts';
import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import CircularProgress from '@material-ui/core/CircularProgress';
import 'i18n-config';
import App from './components/App';
import './index.css';
import { CommandProvider } from 'contexts/CommandContext';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

// Set global application language to Norwegian
document.documentElement.setAttribute('lang', 'no');

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense
          fallback={<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        >
          <CommandProvider>
            <App />
          </CommandProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
