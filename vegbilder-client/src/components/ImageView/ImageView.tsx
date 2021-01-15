import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import Footer from 'components/Footer/Footer';
import SmallMapContainer from 'components/MapContainer/SmallMapContainer';
import ImageViewer from 'components/ImageView/ImageViewer/ImageViewer';
import { TogglesProvider } from 'contexts/TogglesContext';
import { useRecoilValue } from 'recoil';
import { imageSeriesState } from 'recoil/atoms';
import ImageSeriesView from './imageSeriesView/imageSeriesView';

const useStyles = makeStyles((theme) => ({
  content: {
    flex: '1 1 auto', // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: 'relative', // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
  footer: {
    flex: '0 1 4.5rem',
  },
  imageseries: {
    display: 'flex',
    height: '100%',
  },
}));

interface IImageViewProps {
  setView: () => void;
  showSnackbarMessage: (message: string) => void;
}

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const showImageSeries = useRecoilValue(imageSeriesState);

  return (
    <TogglesProvider>
      <Grid item className={classes.content}>
        {showImageSeries ? (
          <div className={classes.imageseries}>
            {' '}
            <ImageViewer
              exitImageView={setView}
              showMessage={showSnackbarMessage}
              showCloseButton={false}
            />
            <ImageSeriesView />{' '}
          </div>
        ) : (
          <ImageViewer
            exitImageView={setView}
            showMessage={showSnackbarMessage}
            showCloseButton={true}
          />
        )}
        <SmallMapContainer />
      </Grid>
      <Grid item className={classes.footer}>
        <Footer showMessage={showSnackbarMessage} />
      </Grid>
    </TogglesProvider>
  );
};

export default ImageView;
