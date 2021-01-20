import React, { SyntheticEvent, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';

import Header from './Header/Header';
import Onboarding from './Onboarding/Onboarding';
import useQueryParamState from 'hooks/useQueryParamState';
import MapView from './MapView/MapView';
import ImageView from './ImageView/ImageView';

const useStyles = makeStyles({
  gridRoot: {
    height: '100%',
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
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const handleSnackbarClose = (event: SyntheticEvent<Element, Event>) => {
    if (event) {
      if (event.type === 'clickaway') {
        return;
      }
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
        return <MapView setView={() => setView(views.imageView)} />;
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
        onClose={handleSnackbarClose}
        className={classes.snackbar}
      >
        <Alert onClose={handleSnackbarClose} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <Onboarding />
    </>
  );
};

export default ComponentsWrapper;
