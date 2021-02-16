import React, { Suspense } from 'react';
import { ThemeProvider } from '@material-ui/core';
import { RecoilRoot } from 'recoil';
import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';

import { CurrentImagePointProvider } from 'contexts/CurrentImagePointContext';
import { CurrentCoordinatesProvider } from 'contexts/CurrentCoordinatesContext';
import { LoadedImagePointsProvider } from 'contexts/LoadedImagePointsContext';
import { CommandProvider } from 'contexts/CommandContext';
import theme from 'theme/Theme';
import { ImageSeriesProvider } from 'contexts/ImageSeriesContext';
import { FilteredImagePointsProvider } from 'contexts/FilteredImagePointsContext';
import ComponentsWrapper from './ComponentsWrapper/ComponentsWrapper';

const App = () => {
  return (
    <RecoilRoot>
      <Suspense
        fallback={<CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <CurrentCoordinatesProvider>
            <LoadedImagePointsProvider>
              <CurrentImagePointProvider>
                <ImageSeriesProvider>
                  <FilteredImagePointsProvider>
                    <CommandProvider>
                      <ComponentsWrapper />
                    </CommandProvider>
                  </FilteredImagePointsProvider>
                </ImageSeriesProvider>
              </CurrentImagePointProvider>
            </LoadedImagePointsProvider>
          </CurrentCoordinatesProvider>
        </ThemeProvider>
      </Suspense>
    </RecoilRoot>
  );
};

export default App;
