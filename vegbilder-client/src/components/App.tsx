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
import ImageView from './ImageView/ImageView';
import MapView from './MapView/MapView';
import Onboarding from './Onboarding/Onboarding';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import {
  latLngQueryParameterState,
  viewQueryParamterState,
  yearQueryParameterState,
  zoomQueryParameterState,
} from 'recoil/selectors';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { DEFAULT_COORDINATES, DEFAULT_VIEW, DEFAULT_ZOOM } from 'constants/defaultParamters';

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
  const [view, setView] = useRecoilState(viewQueryParamterState);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { setCommand } = useCommand();
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngQueryParameterState);
  const [, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [, setCurrentZoom] = useRecoilState(zoomQueryParameterState);
  const [, setCurrentView] = useRecoilState(viewQueryParamterState);

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

  const isDefaultCoordinates = (lat: string | null, lng: string | null) => {
    return (
      lat === null ||
      lng === null ||
      (lat === DEFAULT_COORDINATES.lat.toString() && lng === DEFAULT_COORDINATES.lng.toString())
    );
  };

  useEffect(() => {
    const zoomQuery = searchParams.get('zoom');
    const imageIdQuery = searchParams.get('imageId');
    const latQuery = searchParams.get('lat');
    const lngQuery = searchParams.get('lng');
    const yearQuery = searchParams.get('year');
    const viewQuery = searchParams.get('view');

    // if a user opens the app with only coordinates we find the nearest image from the newest year (or preset year)
    if (!isDefaultCoordinates(latQuery, lngQuery) && !imageIdQuery) {
      setCurrentZoom(15);
      if (yearQuery === 'Nyeste' || !yearQuery) {
        fetchNearestLatestImagePoint(currentCoordinates);
      } else {
        setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
      }
    }
    // if the user shares and image or refresh the page with a selected image, we need to find that image on startup. We assume that year, lat and lng are set when imageId is.
    else if (imageIdQuery && imageIdQuery.length > 1) {
      if (latQuery && lngQuery && yearQuery && yearQuery !== 'latest') {
        const latlng = { lat: parseFloat(latQuery), lng: parseFloat(lngQuery) };
        fetchNearestImagePointToYearAndCoordinatesByImageId(latlng, parseInt(yearQuery));
      }
    }

    // Initialize year, zoom, lat, and lng when opening the app the default way
    else {
      if (!yearQuery) {
        setCurrentYear('Nyeste');
      }
      if (!latQuery || lngQuery) {
        setCurrentCoordinates(DEFAULT_COORDINATES);
      }
      if (!zoomQuery) {
        setCurrentZoom(DEFAULT_ZOOM);
      }
      if (!viewQuery) {
        setCurrentView(DEFAULT_VIEW);
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
        return <MapView setView={() => setView('image')} showMessage={showSnackbarMessage} />;
      case views.imageView:
        return (
          <ImageView setView={() => setView('map')} showSnackbarMessage={showSnackbarMessage} />
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
              <Header showMessage={showSnackbarMessage} setMapView={() => setView('map')} />
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
