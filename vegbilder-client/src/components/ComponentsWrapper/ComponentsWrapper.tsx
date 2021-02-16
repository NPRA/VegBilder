import React, { useEffect, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';

import Header from '../Header/Header';
import Onboarding from './Onboarding/Onboarding';
import useQueryParamState from 'hooks/useQueryParamState';
import MapView from '../MapView/MapView';
import ImageView from '../ImageView/ImageView';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentYearState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';

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

const ComponentsWrapper = () => {
  const classes = useStyles();
  const [view, setView] = useQueryParamState('view');
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const { setCommand } = useCommand();
  const [currentImageQuery] = useQueryParamState('imageId');
  const [currentZoomQuery] = useQueryParamState('zoom');
  const [, setCurrentYearQuery] = useQueryParamState('year');

  // if a user opens the app with only coordinates we find the nearest image from the newest year
  useEffect(() => {
    if (currentImageQuery === '' && currentZoomQuery && parseInt(currentZoomQuery) > 14) {
      if (currentYear === 'Nyeste') {
        setCurrentYear(availableYears[0]);
        setCurrentYearQuery(availableYears[0].toString());
      }
      setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageQuery, currentZoomQuery]);

  const handleSnackbarClose = (reason: any) => {
    if (reason && reason._reactName !== 'onClick') {
      return;
    }
    setSnackbarVisible(false);
  };

  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
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
    <>
      <Grid container direction="column" className={classes.gridRoot} wrap="nowrap">
        <Grid item className={classes.header}>
          <Header showMessage={showSnackbarMessage} />
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
    </>
  );
};

export default ComponentsWrapper;
