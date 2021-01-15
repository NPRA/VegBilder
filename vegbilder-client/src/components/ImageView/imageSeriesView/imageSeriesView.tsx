import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { useImageSeries } from 'contexts/ImageSeriesContext';
import Theme from 'theme/Theme';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { getImageUrl, getRoadReference } from 'utilities/imagePointUtilities';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '1rem',
    height: '100%',
    width: '40%',
    maxWidth: '35rem',
    backgroundColor: '#444F55',
    color: '#c4c4c4',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    margin: 0,
    alignSelf: 'center',
    paddingBottom: '1rem',
  },
  image: {
    //height: '10%',
    width: '90%',
    alignSelf: 'center',
    paddingBottom: '1rem',
    borderRadius: '4px',
  },
}));

const ImageSeriesView = () => {
  const { availableImageSeries, currentImageSeries, setCurrentImageSeries } = useImageSeries();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { loadedImagePoints } = useLoadedImagePoints();

  const classes = useStyles();

  const getImageSeries = () => {
    if (loadedImagePoints && currentImagePoint) {
      const roadReference = getRoadReference(currentImagePoint).withoutMeter;
      //const currentImageDate = getDateString(currentImagePoint);
      const imagePointsForRoadReferenceGroupedByDate =
        loadedImagePoints.imagePointsGroupedBySeries[roadReference];

      console.log(imagePointsForRoadReferenceGroupedByDate);
      // let availableDates = [];
      // if (imagePointsForRoadReferenceGroupedByDate) {
      //   availableDates = Object.getOwnPropertyNames(imagePointsForRoadReferenceGroupedByDate);
      //   console.log(availableDates);
      // }
    }
  };

  getImageSeries();

  return (
    <Paper className={classes.content} square={true}>
      <h4 className={classes.header}>Vegbilder fra samme sted</h4>
      {currentImagePoint && (
        <img
          src={getImageUrl(currentImagePoint)}
          alt="vegbilde"
          className={classes.image}
          //ref={imgRef}
          //onLoad={onImageLoaded}
        />
      )}
    </Paper>
  );
};

export default ImageSeriesView;
