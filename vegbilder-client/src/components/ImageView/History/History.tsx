import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography } from '@material-ui/core';
import groupBy from 'lodash/groupBy';
import { Dictionary } from 'lodash';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  getBearingBetweenImagePoints,
  getDateString,
  getDistanceToBetweenImagePoints,
  getImagePointLatLng,
  getImageUrl,
  getRoadReference,
} from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { SelectIcon } from 'components/Icons/Icons';
import { availableYearsQuery } from 'recoil/selectors';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { currentHistoryImageState, currentYearState, isHistoryModeState } from 'recoil/atoms';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import useQueryParamState from 'hooks/useQueryParamState';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';

const useStyles = makeStyles((theme) => ({
  historyContent: {
    padding: '1rem',
    width: '40%',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  historyHeader: {
    display: 'flex',
    padding: '0.5rem 0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    zIndex: 5,
    top: 0,
    background: 'rgba(68,79,85, 0.8)',
    marginBottom: '1rem',
  },
  headerText: {
    margin: 0,
  },
  closeButton: {
    position: 'absolute',
    right: 0,
  },
  imageContainer: {
    alignSelf: 'center',
    position: 'relative',
    paddingBottom: '1rem',
  },
  image: {
    display: 'block',
    width: '100%',
    paddingBottom: '0.5rem',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  selectIcon: {
    position: 'absolute',
    top: '0.2rem',
    right: '0.2rem',
  },
  info: {
    display: 'flex',
    justifyContent: 'space-evenly',
    margin: 0,
    paddingBottom: '1rem',
  },
}));

const getDateObj = (imagePoint: IImagePoint) => {
  const dateString = getDateString(imagePoint); // format: 2020-08-20
  return new Date(dateString);
};

const getDateObjWithTime = (imagePoint: IImagePoint) => {
  const dateString = imagePoint.properties.TIDSPUNKT; // format: 2020-08-20T09:30:19Z
  return new Date(dateString);
};

const sortImagePointsByDate = (imagePoints: IImagePoint[]) => {
  return imagePoints.sort((a, b) => getDateObj(b).getTime() - getDateObj(a).getTime());
};

const getDateAndTimeString = (imagePoint: IImagePoint) => {
  const { TIDSPUNKT } = imagePoint.properties;
  const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
  return `${dateTime?.date} kl. ${dateTime?.time}`;
};

const History = () => {
  const classes = useStyles();

  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const [currentHistoryImage, setCurrentHistoryImage] = useRecoilState(currentHistoryImageState);
  const [, setHistoryMode] = useRecoilState(isHistoryModeState);

  const { setCurrentCoordinates } = useCurrentCoordinates();
  const [, setQueryParamYear] = useQueryParamState('year');
  const [, setQueryParamImageId] = useQueryParamState('imageId');
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { filteredImagePoints } = useFilteredImagePoints();

  const [historyImagePoints, setHistoryImagePoints] = useState<IImagePoint[]>([]);

  const handleImageClick = (imagePoint: IImagePoint) => {
    setCurrentHistoryImage(imagePoint);
    setCurrentCoordinates({ latlng: getImagePointLatLng(imagePoint) });
    setQueryParamImageId(imagePoint.id);
    if (imagePoint.properties.AAR !== currentYear) {
      setCurrentYear(imagePoint.properties.AAR);
      setQueryParamYear(imagePoint.properties.AAR.toString());
    }
  };

  const onClose = () => {
    if (currentHistoryImage) {
      setCurrentImagePoint(currentHistoryImage);
    }
    setHistoryMode(false);
  };

  const getCurrentImagePointBearing = (
    imagePoints: IImagePoint[],
    currentImagePoint: IImagePoint
  ) => {
    const currentImagePointDateWithTime = getDateObjWithTime(currentImagePoint).getTime();

    // find an image point within 30 seconds from currentImagePoint (which is then most likely on the same line)
    const imagePointCloseToCurrent = imagePoints.find(
      (imagePoint) =>
        getDateObjWithTime(imagePoint).getTime() < currentImagePointDateWithTime + 30000 &&
        getDateObjWithTime(imagePoint).getTime() > currentImagePointDateWithTime - 30000
    );

    if (imagePointCloseToCurrent) {
      return getBearingBetweenImagePoints(currentImagePoint, imagePointCloseToCurrent);
    }
  };

  // I useEffekt'en finner vi bilder som er nærmest current image point innen hver tilgjengelige dato.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  // For å finne retningen av bildet så har vi to muligheter: se på retning (som ikke alle bilder har), eller regne ut bearing.
  // I de tilfellene vi må regne ut bearing (når bildet ikke har retning) så finner vi først bearing mellom currentImagePoint og et nærliggende bilde (et bilde tatt
  // mindre enn 30 sek etter må være veldig nærliggende). Også sammenligner vi den bearingen/retningen med de resterende bildene.
  // til slutt så finner vi det bildet som er absolutt nærmest.
  useEffect(() => {
    if (currentImagePoint) {
      setCurrentHistoryImage(currentImagePoint);
      const currentCoordinates = getImagePointLatLng(currentImagePoint);

      const bbox = {
        west: currentCoordinates?.lng,
        south: currentCoordinates?.lat,
        east: currentCoordinates?.lng, // create the smallest possible bbox area
        north: currentCoordinates?.lat,
      };

      const currentImagePointTime = getDateObj(currentImagePoint).getTime();
      const currentImagePointBearing = getCurrentImagePointBearing(
        filteredImagePoints,
        currentImagePoint
      );
      const currentImagePointDirection = currentImagePoint.properties.RETNING;

      const maxDistance = 50; // meters (avoid getting a picture on a totally different road)

      setHistoryImagePoints((prevState) => [currentImagePoint, ...prevState]);

      availableYears.forEach(async (year) => {
        await getImagePointsInTilesOverlappingBbox(bbox, year).then((res) => {
          const imagePoints = res.imagePoints;
          const uniqueDates: Set<number> = new Set();
          const imagePointsGroupedByTime: Dictionary<IImagePoint[]> = groupBy(
            imagePoints,
            (imagePoint: IImagePoint) => {
              const time = getDateObj(imagePoint).getTime();
              if (time !== currentImagePointTime) {
                uniqueDates.add(time);
                return time;
              }
            }
          );

          [...uniqueDates].forEach((date) => {
            const imagePointsInSameDirection = imagePointsGroupedByTime[date].filter(
              (imagePoint: IImagePoint) => {
                if (imagePoint) {
                  const distanceBetween = getDistanceToBetweenImagePoints(
                    currentImagePoint,
                    imagePoint
                  );
                  if (distanceBetween < maxDistance) {
                    const imagePointDirection = imagePoint.properties.RETNING; // this property is more reliable than bearing, so we check this first.
                    if (
                      imagePointDirection &&
                      currentImagePointDirection &&
                      imagePointDirection < currentImagePointDirection + 10 &&
                      imagePointDirection > currentImagePointDirection - 10
                    ) {
                      return imagePoint;
                    } else {
                      const bearingBetween = getBearingBetweenImagePoints(
                        currentImagePoint,
                        imagePoint
                      );
                      if (
                        currentImagePointBearing &&
                        bearingBetween < currentImagePointBearing + 10 &&
                        bearingBetween > currentImagePointBearing - 10
                      ) {
                        return imagePoint;
                      }
                    }
                  }
                }
              }
            );
            if (imagePointsInSameDirection.length) {
              const closestImagePointInSameDirection = imagePointsInSameDirection.reduce(
                (prevImgpoint, currImgPoint) => {
                  return getDistanceToBetweenImagePoints(currentImagePoint, prevImgpoint) <
                    getDistanceToBetweenImagePoints(currentImagePoint, currImgPoint)
                    ? prevImgpoint
                    : currImgPoint;
                }
              );
              if (closestImagePointInSameDirection) {
                setHistoryImagePoints((prevState) => [
                  ...prevState,
                  closestImagePointInSameDirection,
                ]);
              }
            }
          });
        });
      });
    }
    return () => {
      setHistoryImagePoints([]);
    };
  }, [currentImagePoint, availableYears, setCurrentHistoryImage]);

  return (
    <Paper className={classes.historyContent} square={true}>
      <div className={classes.historyHeader}>
        <Typography variant="h3" className={classes.headerText}>
          Vegbilder fra samme sted
        </Typography>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>
      {currentImagePoint &&
        sortImagePointsByDate(historyImagePoints)?.map((imagePoint) => (
          <>
            <div key={`${imagePoint.id}-container`} className={classes.imageContainer}>
              {imagePoint.id === currentHistoryImage?.id && (
                <SelectIcon key={`${imagePoint.id}-icon`} className={classes.selectIcon} />
              )}
              <img
                key={imagePoint.id}
                src={getImageUrl(imagePoint)}
                alt={imagePoint.id}
                className={classes.image}
                onClick={() => handleImageClick(imagePoint)}
              />
            </div>
            <div className={classes.info}>
              <Typography variant="h5" key={`${imagePoint.id}-reference`}>
                {' '}
                {`${getRoadReference(imagePoint).complete}   `}{' '}
              </Typography>
              <Typography variant="body1" key={`${imagePoint.id}-date`}>
                {' '}
                {getDateAndTimeString(imagePoint)}{' '}
              </Typography>
            </div>
          </>
        ))}
    </Paper>
  );
};

export default History;
