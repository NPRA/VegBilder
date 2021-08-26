import React from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { StatisticsInfoBox } from '../StatisticsInfoBox/StatisticsInfoBox';

import Map from 'components/MapView/Map/Map';
import ImagePreviewAndInformation from './ImagePreviewAndInformation/ImagePreviewAndInformation';
import RoadColorExplaination from './RoadColorExplaination/RoadColorExplaination';

const useStyles = makeStyles({
  content: {
    height: '100%',
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
      <StatisticsInfoBox></StatisticsInfoBox>
      <Map showMessage={showMessage} />
      <ImagePreviewAndInformation openImageView={setView} />
      <RoadColorExplaination />
    </Grid>
  );
};

export default MapView;
