import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';
import groupBy from 'lodash/groupBy';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  getBearingBetweenImagePoints,
  getDateString,
  getDistanceToBetweenImagePoints,
  getFormattedDateString,
  getImagePointLatLng,
  getImageUrl,
} from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { SelectIcon } from 'components/Icons/Icons';
import { availableYearsQuery } from 'recoil/selectors';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { currentYearState, imageSeriesState } from 'recoil/atoms';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import useQueryParamState from 'hooks/useQueryParamState';
import { Dictionary } from 'lodash';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';

const useStyles = makeStyles((theme) => ({
  imageSeriesContent: {
    padding: '1rem',
    width: '40%',
    backgroundColor: '#444F55',
    color: '#c4c4c4', // why is theme not working with ts?
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  imageSeriesHeader: {
    display: 'flex',
    padding: '0.5rem 0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    zIndex: 5,
    top: 0,
    background: 'rgba(68,79,85, 0.8)',
  },
  header: {
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
  date: {
    alignSelf: 'center',
    fontSize: '0.9375rem',
    fontWeight: 500,
    margin: 0,
    paddingBottom: '1rem',
  },
}));

interface IImageSeriesProps {
  currentHistoryImage: IImagePoint | null;
  setCurrentHistoryImage: React.Dispatch<React.SetStateAction<IImagePoint | null>>;
}

const getDateObj = (imagePoint: IImagePoint) => {
  const dateString = getDateString(imagePoint);
  const splitted = dateString.split('-');
  const day = splitted[2];
  const month = splitted[1];
  const year = splitted[0];
  return new Date(year, month, day);
};

const getDateObjWithTime = (imagePoint: IImagePoint) => {
  const dateString = imagePoint.properties.TIDSPUNKT; // format: 2020-08-20T09:30:19Z
  return new Date(dateString);
};

const sortImagePointsByDate = (imagePoints: IImagePoint[]) => {
  return imagePoints.sort((a, b) => getDateObj(b).getTime() - getDateObj(a).getTime());
};

const ImageSeriesView = ({ currentHistoryImage, setCurrentHistoryImage }: IImageSeriesProps) => {
  const classes = useStyles();

  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const [, setQueryParamYear] = useQueryParamState('year');
  //const [currentHistoryImage, setCurrentHistoryImage] = useState<IImagePoint | null>(null);

  const [historyImagePoints, setHistoryImagePoints] = useState<IImagePoint[]>([]);

  const [, setShowImageSeries] = useRecoilState(imageSeriesState);
  const { filteredImagePoints } = useFilteredImagePoints();

  const handleImageClick = (imagePoint: IImagePoint) => {
    setCurrentHistoryImage(imagePoint);
    setCurrentCoordinates({ latlng: getImagePointLatLng(imagePoint) });
    // if (imagePoint.properties.AAR !== currentYear) {
    //   setCurrentYear(imagePoint.properties.AAR);
    //   setQueryParamYear(imagePoint.properties.AAR.toString());
    // }
  };

  const onClose = () => {
    if (currentHistoryImage) {
      setCurrentImagePoint(currentHistoryImage);
      if (currentHistoryImage.properties.AAR !== currentYear) {
        setCurrentYear(currentHistoryImage.properties.AAR);
        setQueryParamYear(currentHistoryImage.properties.AAR.toString());
      }
    }
    setShowImageSeries(false);
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

  // I useEffekt'en finner vi bilder som er mindre enn 20 meter unna current image point.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  // Dette gjøres ved å finne distanse i meter ved hjelp av koordinatene, samt å finne ut av om den er en del av det feltet.
  // Bildene er sortert på tid, og vi velger første og beste som matcher mindre enn 20 meter og i samme felt fra hver tid (dato).
  // Vi ser på retning for å finne ut av om punktet er en del av feltet.
  useEffect(() => {
    if (currentImagePoint) {
      setCurrentHistoryImage(currentImagePoint);
      const currentCoordinates = getImagePointLatLng(currentImagePoint);
      const bbox = {
        west: currentCoordinates?.lng,
        south: currentCoordinates?.lat,
        east: currentCoordinates?.lng + 0.001,
        north: currentCoordinates?.lat + 0.001,
      };

      const currentImagePointTime = getDateObj(currentImagePoint).getTime();

      const currentImagePointBearing = getCurrentImagePointBearing(
        filteredImagePoints,
        currentImagePoint
      );

      const currentImagePointDirection = currentImagePoint.properties.RETNING;

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
            imagePointsGroupedByTime[date].some((imagePoint: IImagePoint) => {
              if (imagePoint) {
                const distance = getDistanceToBetweenImagePoints(currentImagePoint, imagePoint);
                if (distance < 20) {
                  const imagePointDirection = imagePoint.properties.RETNING;
                  if (imagePointDirection && currentImagePointDirection) {
                    if (
                      imagePointDirection < currentImagePointDirection + 10 &&
                      imagePointDirection > currentImagePointDirection - 10
                    ) {
                      setHistoryImagePoints((prevState) => [...prevState, imagePoint]);
                      return true;
                    }
                  } else {
                    const bearingBetween = getBearingBetweenImagePoints(
                      currentImagePoint,
                      imagePoint
                    );
                    if (
                      currentImagePointBearing &&
                      bearingBetween < currentImagePointBearing + 20 &&
                      bearingBetween > currentImagePointBearing - 20
                    ) {
                      setHistoryImagePoints((prevState) => [...prevState, imagePoint]);
                      return true;
                    }
                  }
                }
              }
              return false;
            });
          });
        });
      });
    }
    return () => {
      setHistoryImagePoints([]);
    };
  }, [currentImagePoint, availableYears, setCurrentHistoryImage]);

  return (
    <Paper className={classes.imageSeriesContent} square={true}>
      <div className={classes.imageSeriesHeader}>
        <h4 className={classes.header}>Vegbilder fra samme sted</h4>
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
            <p key={`${imagePoint.id}-date`} className={classes.date}>
              {' '}
              {getFormattedDateString(getDateString(imagePoint))}{' '}
            </p>
            <p key={`${imagePoint.id}-retning`} className={classes.date}>
              {' '}
              {imagePoint.properties.RETNING}{' '}
            </p>
          </>
        ))}
    </Paper>
  );
};

export default ImageSeriesView;
