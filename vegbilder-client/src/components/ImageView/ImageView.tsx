import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import Footer from 'components/Footer/Footer';
import SmallMapContainer from 'components/MapContainer/SmallMapContainer';
import ImageViewer from 'components/ImageView/ImageViewer/ImageViewer';
import { TogglesProvider } from 'contexts/TogglesContext';

const useStyles = makeStyles({
  content: {
    flex: '1 1 auto', // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: 'relative', // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
  footer: {
    flex: '0 1 4.5rem',
  },
});

interface IImageViewProps {
  setView: () => void;
  showSnackbarMessage: () => void;
}

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();

  return (
    <TogglesProvider>
      <Grid item className={classes.content}>
        <ImageViewer exitImageView={setView} showMessage={showSnackbarMessage} />
        <SmallMapContainer />
      </Grid>
      <Grid item className={classes.footer}>
        <Footer showMessage={showSnackbarMessage} />
      </Grid>
    </TogglesProvider>
  );
};

export default ImageView;
