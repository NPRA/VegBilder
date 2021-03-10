import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Snackbar, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useRecoilState, useRecoilValue } from 'recoil';

import { commandTypes, useCommand } from 'contexts/CommandContext';
import theme from 'theme/Theme';
import { ImageSeriesProvider } from 'contexts/ImageSeriesContext';
import { FilteredImagePointsProvider } from 'contexts/FilteredImagePointsContext';
import Header from './Header/Header';
import useQueryParamState from 'hooks/useQueryParamState';
import ImageView from './ImageView/ImageView';
import MapView from './MapView/MapView';
import Onboarding from './Onboarding/Onboarding';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { imagePointQueryParameterState, yearQueryParameterState } from 'recoil/selectors';
import { find } from 'lodash';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';

const useStyles = makeStyles({
  gridRoot: {
    height: '100%',
    fontFamily: '"LFT-Ethica"',
  },
  header: {
    flex: '0 1 5rem', // Do not allow the grid item containing the header to grow. Height depends on content
    zIndex: 1,
  },
  snackbar: {
    opacity: '85%',
    bottom: '5.75rem',
    '& div': {
      '& button': {
        backgroundColor: 'transparent',
        color: 'white',
        '&:hover': {
          backgroundColor: 'transparent',
        },
      },
    },
  },
});

const views = {
  mapView: 'map',
  imageView: 'image',
};

const Alert = (props: AlertProps) => <MuiAlert elevation={6} variant="filled" {...props} />;

const App = () => {
  const classes = useStyles();
  const [view, setView] = useQueryParamState('view');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { setCommand } = useCommand();
  const { currentCoordinates } = useCurrentCoordinates();
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);

  const searchParams = new URLSearchParams(window.location.search);

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const fetchNearestLatestImagePoint = useFetchNearestLatestImagePoint(
    showSnackbarMessage,
    'Fant ingen bilder i nærheten av angitte koordinater'
  );

  // if a user opens the app with only coordinates we find the nearest image from the newest year
  useEffect(() => {
    const currentZoomQuery = searchParams.get('zoom');
    const currentImageId = searchParams.get('imageId');
    if (
      currentImageId === '' ||
      (!currentImageId && currentZoomQuery && parseInt(currentZoomQuery) > 14)
    ) {
      if (currentYear === 'Nyeste') {
        fetchNearestLatestImagePoint(currentCoordinates.latlng);
      } else {
        setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
      }
    }
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get('year')) {
      setCurrentYear('Nyeste');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSnackbarClose = (reason: any) => {
    if (reason && reason._reactName !== 'onClick') {
      return;
    }
    setSnackbarVisible(false);
  };

  const renderContent = () => {
    switch (view) {
      case views.mapView:
        return (
          <MapView setView={() => setView(views.imageView)} showMessage={showSnackbarMessage} />
        );
      case views.imageView:
        return (
          <ImageView
            setView={() => setView(views.mapView)}
            showSnackbarMessage={showSnackbarMessage}
          />
        );
      default:
        throw Error('No valid view set');
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ImageSeriesProvider>
        <FilteredImagePointsProvider>
          <Grid container direction="column" className={classes.gridRoot} wrap="nowrap">
            <Grid item className={classes.header}>
              <Header showMessage={showSnackbarMessage} setMapView={() => setView(views.mapView)} />
            </Grid>
            {renderContent()}
          </Grid>
          <Snackbar
            key={snackbarMessage}
            open={snackbarVisible}
            autoHideDuration={5000}
            onClose={(reason) => handleSnackbarClose(reason)}
            className={classes.snackbar}
          >
            <Alert onClose={(reason) => handleSnackbarClose(reason)} severity="info">
              {snackbarMessage}
            </Alert>
          </Snackbar>
          <Onboarding />
        </FilteredImagePointsProvider>
      </ImageSeriesProvider>
    </ThemeProvider>
  );
};

export default App;
