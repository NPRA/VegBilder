import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';

import MapContainer from 'components/MapContainer/MapContainer';
import ImagePreview from './ImagePreview/ImagePreview';

const useStyles = makeStyles({
  content: {
    flex: '1 1 auto', // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: 'relative', // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
});

interface IMapViewProps {
  setView: () => void;
  showMessage: (message: string) => void;
}

const MapView = ({ setView, showMessage }: IMapViewProps) => {
  const classes = useStyles();

  return (
    <Grid item className={classes.content}>
      <MapContainer showMessage={showMessage} />
      <ImagePreview openImageView={setView} />
    </Grid>
  );
};

export default MapView;
