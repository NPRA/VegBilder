import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilState, useRecoilValue } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  getDateString,
  getDistanceToBetweenImagePoints,
  getFormattedDateString,
  getImagePointLatLng,
  getImageUrl,
  getRoadReference,
  shouldIncludeImagePoint,
} from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { SelectIcon } from 'components/Icons/Icons';
import { availableYearsQuery } from 'recoil/selectors';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { currentYearState } from 'recoil/atoms';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import useQueryParamState from 'hooks/useQueryParamState';

const useStyles = makeStyles((theme) => ({
  imageSeriesContent: {
    padding: '1rem',
    width: '40%',
    backgroundColor: '#444F55',
    color: '#c4c4c4',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
  },
  imageSeriesHeader: {
    display: 'flex',
    paddingBottom: '1rem',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'sticky',
    top: 0,
    backgroundColor: '#444F55',
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
  close: () => void;
}

const getDateObj = (imagePoint: IImagePoint) => {
  const dateString = getDateString(imagePoint);
  const splitted = dateString.split('-');
  const day = splitted[2];
  const month = splitted[1];
  const year = splitted[0];
  return new Date(year, month, day);
};

const sortImagePointsByDate = (imagePoints: IImagePoint[]) => {
  return imagePoints.sort((a, b) => getDateObj(b).getTime() - getDateObj(a).getTime());
};

const ImageSeriesView = ({ close }: IImageSeriesProps) => {
  const classes = useStyles();

  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const [, setQueryParamYear] = useQueryParamState('year');

  const [filteredImagePoints, setFilteredImagePoints] = useState<IImagePoint[]>([]);

  const handleImageClick = (imagePoint: IImagePoint) => {
    if (imagePoint !== currentImagePoint) {
      setCurrentImagePoint(imagePoint);
      setCurrentCoordinates({ latlng: getImagePointLatLng(imagePoint) });
      if (imagePoint.properties.AAR !== currentYear) {
        setCurrentYear(imagePoint.properties.AAR);
        setQueryParamYear(imagePoint.properties.AAR.toString());
      }
      setFilteredImagePoints([]);
    }
  };

  // I useEffekt'en finner vi bilder som er mindre enn 10 meter unna current image point.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  // Dette gjøres ved å finne distanse i meter ved hjelp av koordinatene, samt å finne ut av om den er en del av det feltet.
  useEffect(() => {
    if (currentImagePoint) {
      const currentCoordinates = getImagePointLatLng(currentImagePoint);
      const bbox = {
        west: currentCoordinates?.lng,
        south: currentCoordinates?.lat,
        east: currentCoordinates?.lng + 0.001,
        north: currentCoordinates?.lat + 0.001,
      };

      availableYears.forEach(async (year) => {
        await getImagePointsInTilesOverlappingBbox(bbox, year).then((res) => {
          const imagePoints = res.imagePoints;
          imagePoints.forEach((imagePoint: IImagePoint) => {
            if (imagePoint) {
              const distance = getDistanceToBetweenImagePoints(currentImagePoint, imagePoint);
              if (distance < 20) {
                if (shouldIncludeImagePoint(imagePoint, currentImagePoint)) {
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
  }, [currentImagePoint, availableYears]);

  return (
    <Paper className={classes.imageSeriesContent} square={true}>
      <div className={classes.imageSeriesHeader}>
        <h4 className={classes.header}>Vegbilder fra samme sted</h4>
        <IconButton onClick={close} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>
      {currentImagePoint &&
        sortImagePointsByDate(filteredImagePoints)?.map((imagePoint) => (
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
                onClick={() => handleImageClick(imagePoint)}
              />
            </div>
            <p key={`${imagePoint.id}-date`} className={classes.date}>
              {' '}
              {getFormattedDateString(getDateString(imagePoint))}{' '}
            </p>
          </>
        ))}
    </Paper>
  );
};

export default ImageSeriesView;
