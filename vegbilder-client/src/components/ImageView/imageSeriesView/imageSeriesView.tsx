import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilValue } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton } from '@material-ui/core';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  getDateString,
  getDistanceToBetweenImagePoints,
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
  imageSeriesContent: {
    padding: '1rem',
    width: '40%',
    backgroundColor: '#444F55',
    color: '#c4c4c4',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
  },
  imageSeriesHeader: {
    display: 'flex',
    paddingBottom: '1rem',
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
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
    paddingBottom: '1rem',
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
    padding: '10rem',
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
  const { currentCoordinates } = useCurrentCoordinates();
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentYear = useRecoilValue(currentYearState);

  const [filteredImagePoints, setFilteredImagePoints] = useState<IImagePoint[]>([]);

  // I useEffekt'en finner vi bilder som er mindre enn 10 meter unna current image point.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  useEffect(() => {
    if (currentImagePoint) {
      const bbox = {
        west: currentCoordinates.latlng.lng,
        south: currentCoordinates.latlng.lat,
        east: currentCoordinates.latlng.lng + 0.01,
        north: currentCoordinates.latlng.lat + 0.01,
      };
      const currentImagePointFeltCode = currentImagePoint.properties.FELTKODE;

      availableYears.forEach(async (year) => {
        await getImagePointsInTilesOverlappingBbox(bbox, year).then((res) => {
          const imagePoints = res.imagePoints;
          imagePoints.forEach((imagePoint: IImagePoint) => {
            if (imagePoint) {
              const distance = getDistanceToBetweenImagePoints(currentImagePoint, imagePoint);
              if (distance < 10) {
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

  const handleImageClick = (imagePoint: IImagePoint) => {
    if (imagePoint !== currentImagePoint) {
      setCurrentImagePoint(imagePoint);
    }
  };

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
