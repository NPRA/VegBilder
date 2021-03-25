import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import CircularProgress from '@material-ui/core/CircularProgress';

import App from './components/App';
import './index.css';
import { CommandProvider } from 'contexts/CommandContext';
import { LoadedImagePointsProvider } from 'contexts/LoadedImagePointsContext';
import ErrorBoundary from 'components/ErrorBoundary/ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ErrorBoundary>
        <Suspense
          fallback={<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
        >
          <LoadedImagePointsProvider>
            <CommandProvider>
              <App />
            </CommandProvider>
          </LoadedImagePointsProvider>
        </Suspense>
      </ErrorBoundary>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
