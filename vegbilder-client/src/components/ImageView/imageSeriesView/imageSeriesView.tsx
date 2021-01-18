import React, { useCallback, useEffect, useState } from 'react';
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
import getImagePointsInBbox from 'apis/VegbilderOGC/getImagePointsInBbox';
import { useLeafletBounds, useLeafletCenter } from 'use-leaflet';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { currentYearState } from 'recoil/atoms';
import { createSquareBboxAroundPoint } from 'utilities/latlngUtilities';
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
  const { loadedImagePoints } = useLoadedImagePoints();
  const { availableImageSeries } = useImageSeries();
  const { currentCoordinates } = useCurrentCoordinates();
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentYear = useRecoilValue(currentYearState);

  const [filteredImagePoints, setFilteredImagePoints] = useState<IImagePoint[]>([]);

  // I useEffekt'en finner vi bilder som er mindre enn 10 meter unna current image point og har annen dato enn current image point.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  useEffect(() => {
    if (loadedImagePoints && currentImagePoint) {
      setFilteredImagePoints([currentImagePoint]); // wait for currentImagePoint to be set before we initialize the state
      const roadReference = getRoadReference(currentImagePoint).withoutMeter;

      const currentImagePointDate = getDateString(currentImagePoint);
      const currentImagePointMeter = Math.round(currentImagePoint.properties.METER);

      const imagePointsForRoadReferenceGroupedByDate =
        loadedImagePoints.imagePointsGroupedBySeries[roadReference];

      availableImageSeries.forEach((date: string) => {
        if (date !== currentImagePointDate) {
          imagePointsForRoadReferenceGroupedByDate[date].forEach((imagePoint: IImagePoint) => {
            if (imagePoint) {
              const imagePointMeter = Math.round(imagePoint.properties.METER);
              if (
                imagePointMeter - currentImagePointMeter < 10 &&
                imagePointMeter - currentImagePointMeter > -10
              ) {
                setFilteredImagePoints((prevState) => [...prevState, imagePoint]);
              }
            }
          });
        }
      });

      const bbox = {
        west: currentCoordinates.latlng.lng,
        south: currentCoordinates.latlng.lat,
        east: currentCoordinates.latlng.lng + 0.01,
        north: currentCoordinates.latlng.lat + 0.01,
      };
      availableYears.forEach(async (year) => {
        if (year === currentYear) {
          return;
        } else {
          await getImagePointsInTilesOverlappingBbox(bbox, year).then((res) => {
            const imagePoints = res.imagePoints;
            imagePoints.forEach((imagePoint) => {
              if (imagePoint) {
                const imagePointMeter = Math.round(imagePoint.properties.METER);
                if (
                  imagePointMeter - currentImagePointMeter < 10 &&
                  imagePointMeter - currentImagePointMeter > -10
                ) {
                  setFilteredImagePoints((prevState) => [...prevState, imagePoint]);
                }
              }
            });
          });
        }
      });
    }
  }, [
    setFilteredImagePoints,
    currentImagePoint,
    loadedImagePoints,
    availableImageSeries,
    availableYears,
    currentYear,
  ]);

  useEffect(() => {
    const currentImagePointMeter = Math.round(currentImagePoint.properties.METER);
  }, [availableYears, currentYear]);

  return (
    <Paper className={classes.content} square={true}>
      <h4 className={classes.header}>Vegbilder fra samme sted</h4>
      {currentImagePoint &&
        filteredImagePoints?.map((imagePoint) => (
          <>
            <div className={classes.imageContainer}>
              {imagePoint === currentImagePoint && <SelectIcon className={classes.selectIcon} />}
              <img
                key={imagePoint.id}
                src={getImageUrl(imagePoint)}
                alt={imagePoint.id}
                className={classes.image}
                //onLoad={onImageLoaded}
              />
            </div>
            <p className={classes.date}> {getFormattedDateString(getDateString(imagePoint))} </p>
            <p> {getRoadReference(imagePoint).complete} </p>
          </>
        ))}
    </Paper>
  );
};

export default ImageSeriesView;
