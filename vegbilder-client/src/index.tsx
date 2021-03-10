import React, { Suspense } from 'react';
import ReactDOM from 'react-dom';
import { RecoilRoot } from 'recoil';
import CircularProgress from '@material-ui/core/CircularProgress';

import App from './components/App';
import './index.css';
import { CommandProvider } from 'contexts/CommandContext';
import { CurrentCoordinatesProvider } from 'contexts/CurrentCoordinatesContext';
import { LoadedImagePointsProvider } from 'contexts/LoadedImagePointsContext';

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <Suspense
        fallback={<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
      >
        <LoadedImagePointsProvider>
          <CurrentCoordinatesProvider>
            <CommandProvider>
              <App />
            </CommandProvider>
          </CurrentCoordinatesProvider>
        </LoadedImagePointsProvider>
      </Suspense>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById('root')
);
