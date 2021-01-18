import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { useImageSeries } from 'contexts/ImageSeriesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { getDateString, getImageUrl, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';

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
    //overflowY: 'auto',
  },
  header: {
    margin: 0,
    alignSelf: 'center',
    paddingBottom: '1rem',
  },
  image: {
    width: '90%',
    alignSelf: 'center',
    paddingBottom: '1rem',
    borderRadius: '4px',
  },
}));

const ImageSeriesView = () => {
  const { currentImagePoint } = useCurrentImagePoint();
  const { loadedImagePoints } = useLoadedImagePoints();
  const { availableImageSeries, currentImageSeries, setCurrentImageSeries } = useImageSeries();

  const [filteredImagePoints, setFilteredImagePoints] = useState<IImagePoint[]>([]);

  const classes = useStyles();

  useEffect(() => {
    if (loadedImagePoints && currentImagePoint) {
      const fullRoadReference = getRoadReference(currentImagePoint).complete;
      const roadReference = getRoadReference(currentImagePoint).withoutMeter;

      const currentImagePointDate = getDateString(currentImagePoint);
      const currentImagePointMeter = Math.round(currentImagePoint.properties.METER);

      console.log(roadReference);

      // const groupedByRoadReference: Dictionary<IImagePoint[]> = groupBy(
      //   loadedImagePoints.imagePoints,
      //   (ip) => getRoadReference(ip).withoutMeter
      // );

      //console.log(groupedByRoadReference[roadReference]);

      const imagePointsForRoadReferenceGroupedByDate =
        loadedImagePoints.imagePointsGroupedBySeries[roadReference];

      availableImageSeries.forEach((date: string) => {
        if (date !== currentImagePointDate) {
          imagePointsForRoadReferenceGroupedByDate[date].forEach((imagePoint: IImagePoint) => {
            if (imagePoint) {
              const imagePointMeter = Math.round(imagePoint.properties.METER);
              if (imagePointMeter - currentImagePointMeter < 5) {
                const newFilteredState = [...filteredImagePoints, imagePoint];
                setFilteredImagePoints(newFilteredState);
                //return;
              }
            }
          });
        }
      });
    }
  }, [
    setFilteredImagePoints,
    currentImagePoint,
    // loadedImagePoints,
    // availableImageSeries,
    // filteredImagePoints,
  ]);

  return (
    <Paper className={classes.content} square={true}>
      <h4 className={classes.header}>Vegbilder fra samme sted</h4>
      {currentImagePoint &&
        filteredImagePoints?.map((imagePoint) => (
          <>
            <img
              key={imagePoint.id}
              src={getImageUrl(imagePoint)}
              alt={imagePoint.id}
              className={classes.image}
              //onLoad={onImageLoaded}
            />
            <p> {imagePoint.properties.TIDSPUNKT} </p>
          </>
        ))}
    </Paper>
  );
};

export default ImageSeriesView;
