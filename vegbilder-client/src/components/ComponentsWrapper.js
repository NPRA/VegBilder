import React from 'react';
import Grid from '@material-ui/core/Grid';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/styles';

import Header from './Header/Header';
import Footer from './Footer/Footer';
import SmallMapContainer from './MapContainer/SmallMapContainer';
import ImageViewer from './ImageViewer/ImageViewer';
import Onboarding from './Onboarding/Onboarding';
import { TogglesProvider } from 'contexts/TogglesContext';
import useQueryParamState from 'hooks/useQueryParamState';
import MapView from './MapView/MapView';

const useStyles = makeStyles({
  gridRoot: {
    height: '100%',
  },
  header: {
    flex: '0 1 5rem', // Do not allow the grid item containing the header to grow. Height depends on content
    zIndex: '1',
  },
  content: {
    flex: '1 1 auto', // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: 'relative', // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
  footer: {
    flex: '0 1 4.5rem',
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

const isValidView = (view) => view === views.mapView || view === views.imageView;

const Alert = (props) => <MuiAlert elevation={6} variant="filled" {...props} />;

const ComponentsWrapper = () => {
  const classes = useStyles();
  const [view, setView] = useQueryParamState('view', views.mapView, isValidView);
  const [snackbarVisible, setSnackbarVisible] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState(null);

  const handleSnackbarClose = (reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarVisible(false);
  };

  const showSnackbarMessage = (message) => {
    setSnackbarMessage(message);
    setSnackbarVisible(true);
  };

  const renderImageView = () => {
    return (
      <TogglesProvider>
        <Grid item className={classes.content}>
          <ImageViewer
            exitImageView={() => {
              setView(views.mapView);
            }}
            showMessage={showSnackbarMessage}
          />
          <SmallMapContainer />
        </Grid>
        <Grid item className={classes.footer}>
          <Footer showMessage={showSnackbarMessage} />
        </Grid>
      </TogglesProvider>
    );
  };

  const renderContent = () => {
    switch (view) {
      case views.mapView:
        return <MapView setView={() => setView(views.imageView)} />;
      case views.imageView:
        return renderImageView();
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
