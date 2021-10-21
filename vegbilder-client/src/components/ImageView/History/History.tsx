import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography } from '@material-ui/core';
import groupBy from 'lodash/groupBy';
import { Dictionary, forEach } from 'lodash';

import {
  getBearingBetweenImagePoints,
  getDateString,
  getDistanceToBetweenImagePoints,
  getFilteredImagePoints,
  getImagePointLatLng,
  getImageType,
  getImageUrl,
  getRoadReference
} from 'utilities/imagePointUtilities';
import { IImagePoint, imageType } from 'types';
import { SelectIcon, PanoramaIcon } from 'components/Icons/Icons';
import {
  availableYearsQuery,
  imagePointQueryParameterState,
  latLngZoomQueryParameterState,
  yearQueryParameterState,
  imageTypeQueryParameterState
} from 'recoil/selectors';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { filteredImagePointsState, loadedImagePointsState } from 'recoil/atoms';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import useFetchImagePointsFromOGC from 'hooks/useFetchImagePointsFromOGC';

const useStyles = makeStyles((theme) => ({
  historyContent: {
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    overflowX: 'hidden',
    width: '100%',
    minWidth: '30%',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
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
  panoramaIcon: {
    position: "absolute",
    bottom: "25px",
    right: "10px",
    fill: theme.palette.common.orangeDark
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

const imagePointsAreOnSameVegkategori = (imagePointA: IImagePoint, imagePointB: IImagePoint) => {
  return imagePointA.properties.VEGKATEGORI === imagePointB.properties.VEGKATEGORI;
};

interface IHistoryProps {
  setIsHistoryMode: (isHistoryMode: boolean) => void;
}

const History = ({ setIsHistoryMode }: IHistoryProps) => {
  const classes = useStyles();

  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);

  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const [historyImagePoints, setHistoryImagePoints] = useState<IImagePoint[]>([]);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const setFilteredImagePoints = useSetRecoilState(filteredImagePointsState);
  const [currentImageType, setCurrentImageType] = useRecoilState(imageTypeQueryParameterState);

  const fetchImagePointsFromOGC = useFetchImagePointsFromOGC();

  const handleImageClick = (imagePoint: IImagePoint) => {
    const latlng = getImagePointLatLng(imagePoint);
    if (latlng) setCurrentCoordinates({ ...latlng, zoom: currentCoordinates.zoom });
    const yearOfClickedImage = imagePoint.properties.AAR;
    if (yearOfClickedImage !== currentYear) {
      setCurrentYear(yearOfClickedImage);
      if (loadedImagePoints) {
        const bbox = loadedImagePoints.bbox;
        fetchImagePointsFromOGC(yearOfClickedImage, bbox, getImageType(imagePoint) as imageType);
      }
    }
    setCurrentImagePoint(imagePoint);
    const clickedImageType = getImageType(imagePoint) as imageType;
    if (clickedImageType !== currentImageType) {
        setCurrentImageType(clickedImageType as imageType);
    };
  };

  useEffect(() => {
    if (loadedImagePoints && currentImagePoint) {
      const filteredImagePoints = getFilteredImagePoints(loadedImagePoints, currentImagePoint);
      setFilteredImagePoints(filteredImagePoints);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadedImagePoints]);

  const onClose = () => {
    setIsHistoryMode(false);
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
    if (currentImagePoint && loadedImagePoints) {
      const shouldNotRecalcualteHistoryImages = historyImagePoints.includes(currentImagePoint);
      if (!shouldNotRecalcualteHistoryImages) {
        setHistoryImagePoints([]);
        const currentCoordinates = getImagePointLatLng(currentImagePoint);
        const currentImagePointTime = getDateObj(currentImagePoint).getTime();
        const currentImagePointBearing = getCurrentImagePointBearing(
          loadedImagePoints.imagePoints,
          currentImagePoint
        );
        const currentImagePointDirection = currentImagePoint.properties.RETNING;

        const maxDistance = 50; // meters (avoid getting a picture on a totally different road)

        setHistoryImagePoints((prevState) => [currentImagePoint, ...prevState]);

        if (currentCoordinates) {
          const bbox = {
            west: currentCoordinates.lng,
            south: currentCoordinates.lat,
            east: currentCoordinates.lng, // create the smallest possible bbox area
            north: currentCoordinates.lat,
          };

          Object.entries(availableYearsForAllImageTypes).forEach(([imageType, years]) => {
            years.forEach(async (year: number) => {
              let typename = imageType === '360' ? `vegbilder_1_0:Vegbilder_360_${year}` : `vegbilder_1_0:Vegbilder_${year}`; 
              await getImagePointsInTilesOverlappingBbox(bbox, typename).then((res) => {
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
                        if (imagePointsAreOnSameVegkategori(currentImagePoint, imagePoint)) {
                          const distanceBetween = getDistanceToBetweenImagePoints(
                            currentImagePoint,
                            imagePoint
                          );
                          if (distanceBetween && distanceBetween < maxDistance) {
                            const imagePointDirection = imagePoint.properties.RETNING; // this property is more reliable than bearing, so we check this first.
                            if (imagePointDirection && currentImagePointDirection) {
                              if (
                                imagePointDirection < currentImagePointDirection + 10 &&
                                imagePointDirection > currentImagePointDirection - 10
                              )
                                return imagePoint;
                            } else {
                              const bearingBetween = getBearingBetweenImagePoints(
                                currentImagePoint,
                                imagePoint
                              );
                              if (
                                currentImagePointBearing &&
                                bearingBetween &&
                                bearingBetween < currentImagePointBearing + 10 &&
                                bearingBetween > currentImagePointBearing - 10
                              ) {
                                return imagePoint;
                              }
                            }
                          }
                        }
                      }
                      return false;
                    }
                  );
                  if (imagePointsInSameDirection.length) {
                    const closestImagePointInSameDirection = imagePointsInSameDirection.reduce(
                      (prevImgpoint, currImgPoint) => {
                        const prevDistance =
                          getDistanceToBetweenImagePoints(currentImagePoint, prevImgpoint) ?? 10000;
                        const currDistance =
                          getDistanceToBetweenImagePoints(currentImagePoint, currImgPoint) ?? 10000;
                        return prevDistance < currDistance ? prevImgpoint : currImgPoint;
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
          });
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImagePoint, availableYearsForAllImageTypes]);

  return (
    <Paper className={classes.historyContent} square={true}>
      <div className={classes.historyHeader}>
        <Typography variant="h3" className={classes.headerText}>
          Samme lokasjon og kjøreretning
        </Typography>
        <IconButton onClick={onClose} className={classes.closeButton}>
          <CloseIcon />
        </IconButton>
      </div>
      {currentImagePoint
        ? sortImagePointsByDate(historyImagePoints)?.map((imagePoint) => (
            <div key={imagePoint.id}>
              <div className={classes.imageContainer}>
                {imagePoint.id === currentImagePoint?.id ? (
                  <SelectIcon className={classes.selectIcon} />
                ) : null}
                <img
                  src={getImageUrl(imagePoint)}
                  alt={imagePoint.id}
                  className={classes.image}
                  onClick={() => handleImageClick(imagePoint)}
                />
                {getImageType(imagePoint) === '360' ? <div className={classes.panoramaIcon}><PanoramaIcon/></div> : null}
              </div>
              <div className={classes.info}>
                <Typography variant="h5">{getRoadReference(imagePoint).complete}</Typography>
                <Typography variant="body1">{getDateAndTimeString(imagePoint)}</Typography>
              </div>
            </div>
          ))
        : null}
    </Paper>
  );
};

export default History;
