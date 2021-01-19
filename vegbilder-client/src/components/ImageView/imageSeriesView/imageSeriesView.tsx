import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilValue } from 'recoil';

import { useImageSeries } from 'contexts/ImageSeriesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import {
  getDateString,
  getFormattedDateString,
  getImageUrl,
  getRoadReference,
} from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { SelectIcon } from 'components/Icons/Icons';
import { availableYearsQuery } from 'recoil/selectors';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { currentYearState } from 'recoil/atoms';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '1rem',
    height: '100%',
    width: '40%',
    backgroundColor: '#444F55',
    color: '#c4c4c4',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  header: {
    margin: 0,
    alignSelf: 'center',
    paddingBottom: '1rem',
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
    paddingBottom: '1rem',
  },
  image: {
    display: 'block',
    width: '100%',
    paddingBottom: '1rem',
    borderRadius: '4px',
  },
  selectIcon: {
    position: 'absolute',
    top: '0.2rem',
    right: '0.2rem',
  },
  date: {
    alignSelf: 'center',
    fontSize: '0.9375rem',
    fontWeight: 500,
    margin: 0,
  },
}));

const ImageSeriesView = () => {
  const classes = useStyles();

  const { currentImagePoint } = useCurrentImagePoint();
  //const { loadedImagePoints } = useLoadedImagePoints();
  //const { availableImageSeries } = useImageSeries();
  const { currentCoordinates } = useCurrentCoordinates();
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentYear = useRecoilValue(currentYearState);

  const [filteredImagePoints, setFilteredImagePoints] = useState<IImagePoint[]>([]);

  // I useEffekt'en finner vi bilder som er mindre enn 10 meter unna current image point.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  useEffect(() => {
    if (currentImagePoint) {
      console.log('here');

      const bbox = {
        west: currentCoordinates.latlng.lng,
        south: currentCoordinates.latlng.lat,
        east: currentCoordinates.latlng.lng + 0.01,
        north: currentCoordinates.latlng.lat + 0.01,
      };

      const currentImagePointMeter = Math.round(currentImagePoint.properties.METER);
      const currentImagePointFeltCode = currentImagePoint.properties.FELTKODE;

      availableYears.forEach(async (year) => {
        await getImagePointsInTilesOverlappingBbox(bbox, year).then((res) => {
          const imagePoints = res.imagePoints;
          imagePoints.forEach((imagePoint) => {
            if (imagePoint) {
              const imagePointMeter = Math.round(imagePoint.properties.METER);
              if (
                imagePointMeter - currentImagePointMeter < 10 &&
                imagePointMeter - currentImagePointMeter > -10
              ) {
                if (
                  currentImagePointFeltCode &&
                  currentImagePointFeltCode === imagePoint.properties.FELTKODE
                ) {
                  setFilteredImagePoints((prevState) => [...prevState, imagePoint]);
                }
              }
            }
          });
        });
      });
    }
    return () => {
      setFilteredImagePoints([]);
    };
  }, [
    currentImagePoint,
    availableYears,
    currentCoordinates.latlng.lat,
    currentCoordinates.latlng.lng,
    currentYear,
  ]);

  return (
    <Paper className={classes.content} square={true}>
      <h4 className={classes.header}>Vegbilder fra samme sted</h4>
      {currentImagePoint &&
        filteredImagePoints?.map((imagePoint) => (
          <>
            <div key={`${imagePoint.id}-container`} className={classes.imageContainer}>
              {imagePoint.id === currentImagePoint.id && (
                <SelectIcon key={`${imagePoint.id}-icon`} className={classes.selectIcon} />
              )}
              <img
                key={imagePoint.id}
                src={getImageUrl(imagePoint)}
                alt={imagePoint.id}
                className={classes.image}
                //onLoad={onImageLoaded}
              />
            </div>
            <p key={`${imagePoint.id}-date`} className={classes.date}>
              {' '}
              {getFormattedDateString(getDateString(imagePoint))}{' '}
            </p>
            <p key={`${imagePoint.id}-ref`}> {getRoadReference(currentImagePoint).complete} </p>
          </>
        ))}
    </Paper>
  );
};

export default ImageSeriesView;
