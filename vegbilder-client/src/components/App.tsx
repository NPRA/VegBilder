import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Snackbar, ThemeProvider } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useRecoilState } from 'recoil';

import { commandTypes, useCommand } from 'contexts/CommandContext';
import theme from 'theme/Theme';
import { ImageSeriesProvider } from 'contexts/ImageSeriesContext';
import { FilteredImagePointsProvider } from 'contexts/FilteredImagePointsContext';
import Header from './Header/Header';
import useQueryParamState from 'hooks/useQueryParamState';
import ImageView from './ImageView/ImageView';
import MapView from './MapView/MapView';
import Onboarding from './Onboarding/Onboarding';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import {
  latLngQueryParameterState,
  yearQueryParameterState,
  zoomQueryParameterState,
} from 'recoil/selectors';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { DEFAULT_COORDINATES, DEFAULT_ZOOM } from 'constants/defaultParamters';

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
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngQueryParameterState);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [currentZoom, setCurrentZoom] = useRecoilState(zoomQueryParameterState);

  const searchParams = new URLSearchParams(window.location.search);

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const fetchNearestLatestImagePoint = useFetchNearestLatestImagePoint(
    showSnackbarMessage,
    'Fant ingen bilder i nærheten av angitte koordinater'
  );

  const fetchNearestImagePointToYearAndCoordinatesByImageId = useFetchNearestImagePoint(
    showSnackbarMessage,
    'Fant ikke angitt bildepunkt. Prøv å klikke i stedet.',
    'findByImageId'
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
        fetchNearestLatestImagePoint(currentCoordinates);
      } else {
        setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
      }
    }
  }, []);

  // Initialize year, zoom, lat, and lng when opening the app
  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    if (!searchParams.get('year')) {
      setCurrentYear('Nyeste');
    }
    if (!searchParams.get('lat') || searchParams.get('lng')) {
      setCurrentCoordinates(DEFAULT_COORDINATES);
    }
    if (!searchParams.get('zoom')) {
      setCurrentZoom(DEFAULT_ZOOM);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // if the user shares and image or refresh the page with a selected image, we need to find that image on startup. We assume that year, lat and lng are set when imageId is.
  useEffect(() => {
    const currentImageId = searchParams.get('imageId');
    const currentLat = searchParams.get('lat');
    const currentLng = searchParams.get('lng');
    const currentYear = searchParams.get('year');

    if (currentImageId && currentImageId.length > 1) {
      if (currentLat && currentLng && currentYear && currentYear !== 'latest') {
        const latlng = { lat: parseFloat(currentLat), lng: parseFloat(currentLng) };
        fetchNearestImagePointToYearAndCoordinatesByImageId(latlng, parseInt(currentYear));
      }
    }
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
