import React, { useEffect, useState } from 'react';
import { Grid, makeStyles, Snackbar, ThemeProvider, Typography } from '@material-ui/core';
import CssBaseline from '@material-ui/core/CssBaseline';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { useRecoilState, useRecoilValue } from 'recoil';

import { commandTypes, useCommand } from 'contexts/CommandContext';
import theme from 'theme/Theme';
import Header from './Header/Header';
import ImageView from './ImageView/ImageView';
import MapView from './MapView/MapView';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import {
  latLngZoomQueryParameterState,
  viewQueryParamterState,
  yearQueryParameterState,
} from 'recoil/selectors';
import { cameraFilterState } from 'recoil/atoms';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { DEFAULT_COORDINATES, DEFAULT_VIEW, DEFAULT_ZOOM } from 'constants/defaultParamters';
import PageInformation from './PageInformation/PageInformation';
import { useIsMobile } from 'hooks/useIsMobile';
import MobileLandingPage from './MobileLandingPage/MobileLandingPage';
import getVegByVegsystemreferanse from 'apis/NVDB/getVegByVegsystemreferanse';
import { getCoordinatesFromWkt } from 'utilities/latlngUtilities';
import { IImagePoint } from 'types';
import useAsyncError from 'hooks/useAsyncError';

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
    color: theme.palette.common.grayDark,
    '& div': {
      '& button': {
        backgroundColor: 'transparent',
        color: theme.palette.common.grayDark,
        '&:hover': {
          backgroundColor: 'transparent',
        },
        '& span': {
          '& svg': {
            '& path': {
              fill: theme.palette.common.grayDarker,
            },
          },
        },
      },
    },
  },
  alertMessage: {
    backgroundColor: '#FFF',
    color: theme.palette.common.grayDarker,
    fontWeight: 500,
  },
  alertIcon: {
    alignSelf: 'center',
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
  const { setCommand } = useCommand();
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [, setCurrentView] = useRecoilState(viewQueryParamterState);
  const currentCameraType = useRecoilValue(cameraFilterState);

  const searchParams = new URLSearchParams(window.location.search);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isMobile = useIsMobile();

  const onbardingIsHidden = localStorage.getItem('HideSplashOnStartup') === 'true';
  const [showPageInformation, setShowPageInformation] = useState(!onbardingIsHidden);

  const throwError = useAsyncError();

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const fetchNearestLatestImagePoint = useFetchNearestLatestImagePoint(
    showSnackbarMessage,
    'Fant ingen bilder i nærheten'
  );

  const fetchNearestImagePointToYearAndCoordinatesByImageId = useFetchNearestImagePoint(
    showSnackbarMessage,
    'Fant ikke angitt bildepunkt. Prøv å klikke i stedet.',
    'findByImageId'
  );

  const fetchNearestImagePointToYearAndCoordinates = useFetchNearestImagePoint(
    showSnackbarMessage,
    'Fant ingen bilder i nærheten'
  );

  const isDefaultCoordinates = (lat: string | null, lng: string | null) => {
    return (
      lat === null ||
      lng === null ||
      (lat === DEFAULT_COORDINATES.lat.toString() && lng === DEFAULT_COORDINATES.lng.toString())
    );
  };

  const openAppByVegsystemreferanse = async (
    vegsystemreferanse: string | undefined,
    year: string | null
  ) => {
    if (vegsystemreferanse) {
      const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
      if (vegResponse) {
        if (vegResponse.status !== 200) {
          throwError(vegResponse);
          return;
        }
        const vegsystemData = vegResponse.data;
        const wkt = vegsystemData.geometri.wkt;
        const latlng = getCoordinatesFromWkt(wkt);

        if (latlng) {
          if (year) {
            fetchNearestImagePointToYearAndCoordinates(latlng, parseInt(year), currentCameraType).then(
              (imagePoint: IImagePoint | undefined) => {
                if (!imagePoint) {
                  setCurrentCoordinates({ ...latlng, zoom: 15 });
                }
              }
            );
          } else {
            fetchNearestLatestImagePoint(latlng);
          }
        }
      }
    }
  };

  useEffect(() => {
    const imageIdQuery = searchParams.get('imageId');
    const latQuery = searchParams.get('lat');
    const lngQuery = searchParams.get('lng');
    const yearQuery = searchParams.get('year');
    const viewQuery = searchParams.get('view');
    const vegsystemreferanseQuery = searchParams.get('vegsystemreferanse');


    if (vegsystemreferanseQuery) {
      openAppByVegsystemreferanse(vegsystemreferanseQuery, yearQuery);
    }

    // if a user opens the app with only coordinates we find the nearest image from the newest year (or preset year)
    if (!isDefaultCoordinates(latQuery, lngQuery) && !imageIdQuery) {
      const latlng = { lat: currentCoordinates.lat, lng: currentCoordinates.lng };
      setCurrentCoordinates({ ...latlng, zoom: 15 });
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
        fetchNearestImagePointToYearAndCoordinatesByImageId(latlng, parseInt(yearQuery), currentCameraType);
      }
    }

    // Initialize year, zoom, lat, and lng when opening the app the default way
    else {
      if (!yearQuery) {
        setCurrentYear('Nyeste');
      }
      if (!latQuery || !lngQuery) {
        setCurrentCoordinates({ ...DEFAULT_COORDINATES, zoom: DEFAULT_ZOOM });
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
      {isMobile ? (
        <MobileLandingPage />
      ) : (
        <>
          <Grid container direction="column" className={classes.gridRoot} wrap="nowrap">
            <Grid item className={classes.header}>
              <Header
                showMessage={showSnackbarMessage}
                setMapView={() => setView('map')}
                showInformation={showPageInformation}
                setShowInformation={setShowPageInformation}
              />
            </Grid>
            {renderContent()}
          </Grid>
          <Snackbar
            key={snackbarMessage}
            open={snackbarVisible}
            autoHideDuration={4000}
            onClose={(reason) => handleSnackbarClose(reason)}
            className={classes.snackbar}
          >
            <Alert
              onClose={(reason) => handleSnackbarClose(reason)}
              severity="info"
              classes={{ root: classes.alertMessage, icon: classes.alertIcon }}
            >
              <Typography variant="subtitle1">{snackbarMessage}</Typography>
            </Alert>
          </Snackbar>
          {showPageInformation ? (
            <PageInformation setVisible={() => setShowPageInformation(false)} />
          ) : null}
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
