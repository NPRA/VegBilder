import React from 'react';
import { ThemeProvider } from '@material-ui/core';

import { CurrentImagePointProvider } from '../contexts/CurrentImagePointContext';
import { CurrentCoordinatesProvider } from '../contexts/CurrentCoordinatesContext';
import { LoadedImagePointsProvider } from '../contexts/LoadedImagePointsContext';
import { CommandProvider } from '../contexts/CommandContext';
import theme from '../theme/Theme';
import { YearFilterProvider } from '../contexts/YearFilterContext';
import { ImageSeriesProvider } from '../contexts/ImageSeriesContext';
import { FilteredImagePointsProvider } from '../contexts/FilteredImagePointsContext';
import ComponentsWrapper from './ComponentsWrapper';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CurrentCoordinatesProvider>
        <YearFilterProvider>
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
        </YearFilterProvider>
      </CurrentCoordinatesProvider>
    </ThemeProvider>
  );
};

export default App;
