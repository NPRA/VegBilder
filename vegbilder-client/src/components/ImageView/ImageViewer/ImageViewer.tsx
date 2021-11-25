import React, { useEffect, useState, useCallback, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import orderBy from 'lodash/orderBy';
import { useRecoilValue, useRecoilState } from 'recoil';

import { useCommand, commandTypes } from 'contexts/CommandContext';
import { isEvenNumber } from 'utilities/mathUtilities';
import {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
  usesOldVegreferanse,
  areOnSameOrConsecutiveRoadParts,
  shouldIncludeImagePoint,
  getImageType,
} from 'utilities/imagePointUtilities';
import MeterLineCanvas from './MeterLineCanvas';
import { playVideoState, filteredImagePointsState } from 'recoil/atoms';
import { IImagePoint } from 'types';
import { imagePointQueryParameterState, latLngZoomQueryParameterState, turnedToOtherLaneState } from 'recoil/selectors';
import { debounce } from 'lodash';
import PanoramaImage from './PanoramaImage/PanoramaImage';

const useStyles = makeStyles((theme) => ({
  imageArea: {
    position:  'relative',
    height: '100%',
    minWidth: '70%',
    backgroundColor: theme.palette.primary.main,
    display: 'flex',
    maxHeight: 'calc(100vh - 10rem)', // Total view height minus the height of the header and footer combined
    maxWidth: '100%',
  },
  image: {
    objectFit: 'contain',
    margin: '0 auto',
    width: '100%',
  },
  enlargedImage: {
    width: 'auto',
    height: 'auto',
    position: 'absolute',
  },
  canvas: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    maxWidth: '100%',
    maxHeight: '100%',
  },
}));

interface IImageViewerProps {
  showMessage: (message: string) => void;
  isZoomedInImage?: boolean;
  timeBetweenImages: number;
  meterLineVisible: boolean;
  isHistoryMode: boolean;
  panoramaIsActive: boolean;
}

const ImageViewer = ({
  showMessage,
  isZoomedInImage,
  timeBetweenImages,
  meterLineVisible,
  isHistoryMode,
  panoramaIsActive
}: IImageViewerProps) => {
  const classes = useStyles();
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const filteredImagePoints = useRecoilValue(filteredImagePointsState);
  const { command, resetCommand } = useCommand();
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [autoPlay, setAutoPlay] = useRecoilState(playVideoState);
  const [, setTurnToOtherLaneSelector] = useRecoilState(turnedToOtherLaneState);

  const [nextImagePoint, setNextImagePoint] = useState<IImagePoint | null>(null);
  const [previousImagePoint, setPreviousImagePoint] = useState<IImagePoint | null>(null);
  const [currentLaneImagePoints, setCurrentLaneImagePoints] = useState<IImagePoint[]>([]);
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);

  const imgRef = useRef<HTMLImageElement>(null);

  const hasOppositeParity = (feltkode1: string, feltkode2: string) => {
    if (!feltkode1 || !feltkode2) return null;
    const primaryFeltkode1 = parseInt(feltkode1[0], 10);
    const primaryFeltkode2 = parseInt(feltkode2[0], 10);
    return isEvenNumber(primaryFeltkode1) !== isEvenNumber(primaryFeltkode2);
  };

  const isOnSameHovedparsell = (HP1: string | null, HP2: string | null) => {
    // for old vegreferanser (before 2020). Most of the time, the oppoiste lane will have the same hovedparselnumber.
    return HP1 === HP2;
  };

  const onImageLoaded = () => {
    const img = imgRef.current;
    if (img) {
      setImageElement(img);
    }
  };

  const goToNearestImagePointInOppositeLane = useCallback(() => {
    if (!currentImagePoint) return;
    if (!filteredImagePoints) return;
    let imagePointsInOppositeLane = filteredImagePoints.filter(
      (ip: IImagePoint) =>
        ip.properties.VEGKATEGORI === currentImagePoint.properties.VEGKATEGORI &&
        ip.properties.VEGSTATUS === currentImagePoint.properties.VEGSTATUS &&
        ip.properties.VEGNUMMER === currentImagePoint.properties.VEGNUMMER &&
        ip.properties.STREKNING === currentImagePoint.properties.STREKNING &&
        ip.properties.DELSTREKNING === currentImagePoint.properties.DELSTREKNING &&
        ip.properties.KRYSSDEL === currentImagePoint.properties.KRYSSDEL &&
        ip.properties.SIDEANLEGGSDEL === currentImagePoint.properties.SIDEANLEGGSDEL &&
        ip.properties.ANKERPUNKT === currentImagePoint.properties.ANKERPUNKT &&
        hasOppositeParity(ip.properties.FELTKODE, currentImagePoint.properties.FELTKODE)
    );

    const usesOldVegreferanse = currentImagePoint.properties.AAR < 2020;
    if (usesOldVegreferanse) {
      imagePointsInOppositeLane = imagePointsInOppositeLane.filter((imagePoint) =>
        isOnSameHovedparsell(currentImagePoint.properties.HP, imagePoint.properties.HP)
      );
    }

    const latlngCurrentImagePoint = getImagePointLatLng(currentImagePoint);

    if (imagePointsInOppositeLane.length === 0 || !latlngCurrentImagePoint) {
      showMessage('Finner ingen nærtliggende bilder i motsatt kjøreretning');
      return;
    }
    const nearestImagePointInOppositeLane = findNearestImagePoint(
      imagePointsInOppositeLane,
      latlngCurrentImagePoint
    );
    if (nearestImagePointInOppositeLane) {
      const latlngNearestImagePointInOppositeLane = getImagePointLatLng(
        nearestImagePointInOppositeLane
      );
      if (latlngNearestImagePointInOppositeLane) {
        setCurrentImagePoint(nearestImagePointInOppositeLane);
        setCurrentCoordinates({ ...latlngNearestImagePointInOppositeLane, zoom: 16 });
        setTurnToOtherLaneSelector(true);  //Flagg til panorama viewer for å sette riktig config. Ikke testet.
      }
    } else {
      showMessage('Finner ingen nærtliggende bilder i motsatt kjøreretning');
    }
  }, [
    currentImagePoint,
    filteredImagePoints,
    setCurrentImagePoint,
    setCurrentCoordinates,
    showMessage,
  ]);

  /* When currentImagePoint changes, we have to reset imageElement to null. Otherwise the imageElement
   * will briefly contain an image with naturalWidth and naturalHeight of 0 (before the image has finished loading),
   * which means we cannot render the MeterLineCanvas on top of the image. (The canvas dimensions are
   * initialized from the image's naturalWidth and naturalHeight).
   */
  useEffect(() => {
    setImageElement(null);
  }, [currentImagePoint]);

  useEffect(() => {
    if (currentImagePoint && filteredImagePoints) {
      const getSortedImagePointsForCurrentLane = () => {
        const currentLaneImagePoints = filteredImagePoints.filter((ip: IImagePoint) =>
          shouldIncludeImagePoint(ip, currentImagePoint)
        );
        const primaryFeltkode = parseInt(currentImagePoint.properties.FELTKODE[0], 10);
        const sortOrder = isEvenNumber(primaryFeltkode) ? 'desc' : 'asc'; // Feltkode is odd in the metering direction and even in the opposite direction
        if (usesOldVegreferanse(currentImagePoint)) {
          return orderBy(
            currentLaneImagePoints,
            ['properties.HP', 'properties.METER'],
            [sortOrder, sortOrder]
          );
        } else {
          return orderBy(
            currentLaneImagePoints,
            ['properties.STREKNING', 'properties.DELSTREKNING', 'properties.METER'],
            [sortOrder, sortOrder, sortOrder]
          );
        }
      };
      if (filteredImagePoints && currentImagePoint) {
        const sortedImagePointsForCurrentLane = getSortedImagePointsForCurrentLane();
        setCurrentLaneImagePoints(sortedImagePointsForCurrentLane);
      }
    }
  }, [filteredImagePoints, currentImagePoint]);

  // Set next and previous image points
  useEffect(() => {
    if (!currentImagePoint || !currentLaneImagePoints || currentLaneImagePoints.length === 0)
      return;

    const currentIndex = currentLaneImagePoints.findIndex((ip) => ip.id === currentImagePoint.id);
    if (currentIndex === -1) {
      setNextImagePoint(null);
      setPreviousImagePoint(null);
      return;
    }

    const nextIndex = currentIndex + 1;
    const previousIndex = currentIndex - 1;

    /* Set the next and previous image points, while making sure we do not exceed the bounds
     * of the currentLaneImagePoints array. We also need to beware of image points which are
     * not close together, even though they are next to each other in the sort order.
     *
     * Typical case for this: We reach the end of a road, which is for instance on strekning/delstrekning
     * S8D1. We try to move forward and are transported to an image point on S8D100 or another large
     * delstrekning-number, which is probably a pedestrian/bike road parallell to the main road.
     *
     * Similar case for older image points (using the old vegreferanse): We reach the end of a road, let's
     * say on hovedparsell HP88. We try to move forward and are transported to an image point on HP1060 (or
     * another large number), which is probably a ramp, roundabout or similar, which is somewhat nearby, but not
     * directly next to where we were.
     *
     * Such jumps should be avoided.
     */

    let nextImagePoint =
      nextIndex < currentLaneImagePoints.length ? currentLaneImagePoints[nextIndex] : null;

    if (nextImagePoint?.id === currentImagePoint.id) return;
    if (
      nextImagePoint &&
      !areOnSameOrConsecutiveRoadParts(currentImagePoint, nextImagePoint) // Avoid jumping to a road part which is not directly connected to the current one
    ) {
      nextImagePoint = null;
    }

    let previousImagePoint = previousIndex >= 0 ? currentLaneImagePoints[previousIndex] : null;
    if (
      previousImagePoint &&
      !areOnSameOrConsecutiveRoadParts(previousImagePoint, currentImagePoint) // Avoid jumping to a road part which is not directly connected to the current one
    ) {
      previousImagePoint = null;
    }
    setNextImagePoint(nextImagePoint);
    setPreviousImagePoint(previousImagePoint);
  }, [currentImagePoint, currentLaneImagePoints]);

  // Apply command if present
  useEffect(() => {
    if (command) {
      let resetCommandAfterExecution = true;
      switch (command) {
        case commandTypes.goForwards:
          if (nextImagePoint) {
            const latlng = getImagePointLatLng(nextImagePoint);
            setCurrentImagePoint(nextImagePoint);
            if (latlng) setCurrentCoordinates({ ...latlng, zoom: currentCoordinates.zoom });
          } else {
            showMessage('Dette er siste bilde i serien. Velg nytt bildepunkt i kartet.');
          }
          break;
        case commandTypes.goBackwards:
          if (previousImagePoint) {
            const latlng = getImagePointLatLng(previousImagePoint);
            setCurrentImagePoint(previousImagePoint);
            if (latlng) setCurrentCoordinates({ ...latlng, zoom: currentCoordinates.zoom });
          } else {
            showMessage('Dette er første bilde i serien. Velg nytt bildepunkt i kartet.');
          }
          break;
        case commandTypes.turnAround:
          goToNearestImagePointInOppositeLane();
          break;
        default:
          // Any other commands do not apply to this component and will be ignored
          resetCommandAfterExecution = false;
      }
      if (resetCommandAfterExecution) {
        resetCommand();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    command,
    resetCommand,
    nextImagePoint,
    previousImagePoint,
    setCurrentCoordinates,
    setCurrentImagePoint,
    goToNearestImagePointInOppositeLane,
    showMessage,
  ]);

  const renderMeterLine = () => {
    if (
      meterLineVisible &&
      imageElement &&
      imageElement.naturalWidth > 0 &&
      imageElement.naturalHeight > 0 &&
      currentImagePoint
    ) {
      return (
        <MeterLineCanvas
          baseLineInfo={currentImagePoint.properties.BASELINEINFO}
          width={imageElement.naturalWidth}
          height={imageElement.naturalHeight}
          className={classes.canvas}
        />
      );
    } else {
      return null;
    }
  };

  useEffect(() => {
    if (autoPlay) {
      if (nextImagePoint) {
        new Image().src = getImageUrl(nextImagePoint);
        playNextImage(nextImagePoint);
      } else {
        setAutoPlay(false);
        showMessage('Stopper film, dette er siste bilde i serien. Velg nytt bildepunkt i kartet.');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, nextImagePoint, timeBetweenImages]);

  const playNextImage = debounce((nextImagePoint: IImagePoint) => {
    const latlng = getImagePointLatLng(nextImagePoint);
    setCurrentImagePoint(nextImagePoint);
    if (latlng) setCurrentCoordinates({ ...latlng, zoom: currentCoordinates.zoom });
  }, timeBetweenImages);

  return (
    <>
      <div className={classes.imageArea}>
        {currentImagePoint && (
           <>
           {panoramaIsActive ? (
             <PanoramaImage 
             imageUrl={getImageUrl(currentImagePoint)} 
             isHistoryMode={isHistoryMode}/>
           ) : (
             <>
               <img
                 id="vegbilde"
                 src={getImageUrl(currentImagePoint)}
                 alt="vegbilde"
                 className={isZoomedInImage ? classes.enlargedImage : classes.image}
                 ref={imgRef}
                 onLoad={onImageLoaded}
               />
               {renderMeterLine()}
             </>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default ImageViewer;
