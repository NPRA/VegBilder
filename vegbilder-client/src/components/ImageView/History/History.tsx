import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import CloseIcon from '@material-ui/icons/Close';
import { IconButton, Typography } from '@material-ui/core';
import groupBy from 'lodash/groupBy';
import { Dictionary } from 'lodash';

import {
  getDateString,
  getFilteredImagePoints,
  getImagePointLatLng,
  getImageType,
  getImageUrl,
  getNearestImagePointInSameDirectionOfImagePoint,
  getRoadReference
} from 'utilities/imagePointUtilities';
import { IImagePoint, ILoadedImagePoints, imageType } from 'types';
import { SelectIcon, UnselectedIcon, PanoramaIcon } from 'components/Icons/Icons';
import {
  availableYearsQuery,
  imagePointQueryParameterState,
  latLngZoomQueryParameterState,
  yearQueryParameterState,
  imageTypeQueryParameterState,
  availableYears
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
  panoramaImage: {
    cursor: 'pointer',
    height: '20vh',
    backgroundSize: '100vw',
    backgroundPosition: 'center',
    borderRadius: '0px 0px 4px 4px'
  },
  image: {
    display: 'block',
    width: '100%',
    borderRadius: '0px 0px 4px 4px',
    cursor: 'pointer',
  },
  infoIcons: {
    display: 'flex',
    flexDirection: 'row',
    columnGap: '10px',
    alignItems: 'center',
    '@media (max-width:780px) and (orientation: portrait)': {
      alignItems: 'flex-end',
      flexDirection: 'column'
    }
  },
  info: {
    display: 'flex',
    flexFlow: 'row no-wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 0,
    padding: '8px 12px',
    borderRadius: '4px 4px 0px 0px',
    backgroundColor: theme.palette.common.grayDarker
  }
}));

const getDateObj = (imagePoint: IImagePoint) => {
  const dateString = getDateString(imagePoint); // format: 2020-08-20
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

interface IHistoryProps {
  setIsHistoryMode: (isHistoryMode: boolean) => void;
}

async function findHistoryImagePoints(
    currentImagePoint: IImagePoint | null, 
   loadedImagePoints: ILoadedImagePoints | null, 
   historyImagePoints: IImagePoint[], setHistoryImagePoints: React.Dispatch<React.SetStateAction<IImagePoint[]>>, 
   availableYearsForAllImageTypes: availableYears) 
   {
    if (currentImagePoint && loadedImagePoints) {
    const shouldNotRecalcualteHistoryImages = historyImagePoints.includes(currentImagePoint);
      if (!shouldNotRecalcualteHistoryImages) {
      setHistoryImagePoints([]);
      const currentCoordinates = getImagePointLatLng(currentImagePoint);
      const currentImagePointTime = getDateObj(currentImagePoint).getTime();

      setHistoryImagePoints((prevState) => [currentImagePoint, ...prevState]);

      if (currentCoordinates) {
        const bbox = {
          west: currentCoordinates.lng,
          south: currentCoordinates.lat,
          east: currentCoordinates.lng, // create the smallest possible bbox area
          north: currentCoordinates.lat,
        };

        for (const [imageType, years] of Object.entries(availableYearsForAllImageTypes)) {
          for (const year of years) {
            let typename = imageType === '360' ? `vegbilder_1_0:Vegbilder_360_${year}` : `vegbilder_1_0:Vegbilder_${year}`;
            await getImagePointsInTilesOverlappingBbox(bbox, typename).then((res) => {
              const imagePoints = res.imagePoints;
              const uniqueDatesInOtherYears: Set<number> = new Set();
              const imagePointsGroupedByTime: Dictionary<IImagePoint[]> = groupBy(
                imagePoints,
                (imagePoint: IImagePoint) => {
                  const time = getDateObj(imagePoint).getTime();
                  if (time !== currentImagePointTime) {
                    uniqueDatesInOtherYears.add(time);
                  }
                  return time;
                }
              );
              for (const uniqueDate of uniqueDatesInOtherYears) {
                const nearestImagePointInSameDirection = getNearestImagePointInSameDirectionOfImagePoint(imagePointsGroupedByTime[uniqueDate], currentImagePoint);
                  if (nearestImagePointInSameDirection) {
                    setHistoryImagePoints((prevState) => [
                      ...prevState,
                      nearestImagePointInSameDirection,
                    ]);
                  }
                }
            });
          }
        }
      }
    }
  }
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
    setCurrentImagePoint(imagePoint);

    const yearOfClickedImage = imagePoint.properties.AAR;
    const clickedImageType = getImageType(imagePoint) as imageType;

    if (yearOfClickedImage !== currentYear) {
      setCurrentYear(yearOfClickedImage);
      if (loadedImagePoints) {
        const bbox = loadedImagePoints.bbox;
        fetchImagePointsFromOGC(yearOfClickedImage, bbox, currentImageType);
      }
    }

    if (clickedImageType !== currentImageType && loadedImagePoints) {
        const bbox = loadedImagePoints.bbox;
        fetchImagePointsFromOGC(currentYear as number, bbox, getImageType(imagePoint) as imageType);
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

  // I useEffekt'en finner vi bilder som er nærmest current image point innen hver tilgjengelige dato.
  // Dette er fordi bilder fra forskjellige datoer som er svært nærtliggende kan ha ulike meterreferanser.
  // For å finne retningen av bildet så har vi to muligheter: se på retning (som ikke alle bilder har), eller regne ut bearing.
  // I de tilfellene vi må regne ut bearing (når bildet ikke har retning) så finner vi først bearing mellom currentImagePoint og et nærliggende bilde (et bilde tatt
  // mindre enn 30 sek etter må være veldig nærliggende). Også sammenligner vi den bearingen/retningen med de resterende bildene.
  // til slutt så finner vi det bildet som er absolutt nærmest.
  useEffect(() => {
    findHistoryImagePoints(currentImagePoint, loadedImagePoints, historyImagePoints, setHistoryImagePoints, availableYearsForAllImageTypes);
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
              <div className={classes.info}>
                <div>
                  <Typography variant="h5">{getRoadReference(imagePoint).complete}</Typography>
                  <Typography variant="body1">{getDateAndTimeString(imagePoint)}</Typography>
                </div>
                <div className={classes.infoIcons}>
                  {getImageType(imagePoint) === '360' ? <PanoramaIcon/> : null}
                  {imagePoint.id === currentImagePoint?.id ?
                    <SelectIcon /> : <UnselectedIcon />}
                </div>
              </div>
              <div className={classes.imageContainer}>
                {getImageType(imagePoint) === '360' ?
                  <>
                    <div 
                    className={classes.panoramaImage} 
                    style={{"backgroundImage" : `url(${getImageUrl(imagePoint)})`}} 
                    role="img"
                    aria-label="Bilde tatt langs veg"
                    onClick={() => handleImageClick(imagePoint)}>
                    </div>
                  </> :
                  <img
                  src={getImageUrl(imagePoint)}
                  alt={imagePoint.id}
                  className={classes.image}
                  onClick={() => handleImageClick(imagePoint)}
                />
              }
              </div>
            </div>
          ))
        : null}
    </Paper>
  );
};

export default History;
