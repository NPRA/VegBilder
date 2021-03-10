import { useState, useCallback } from 'react';
import { useLeafletBounds, useLeafletCenter } from 'use-leaflet';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint, getGenericRoadReference } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';

const useFetchNearestImagePoint = (
  showMessage: (message: string) => void,
  errorMessage = 'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
) => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const {
    currentImagePoint,
    setCurrentImagePoint,
    unsetCurrentImagePoint,
  } = useCurrentImagePoint();
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();

  async function fetchImagePointsByYearAndLatLng(
    latlng: ILatlng,
    year: number,
    isSmallMapConatiner = false
  ) {
    if (isFetching) return;
    const bboxVisibleMapArea = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox);
    if (shouldFetchNewImagePointsFromOGC) {
      setIsFetching(true);
      let targetBbox;
      if (isSmallMapConatiner) {
        const [lat, lng] = mapCenter;
        targetBbox = createSquareBboxAroundPoint({ lat, lng }, settings.targetBboxSize);
      } else {
        targetBbox = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
      }
      const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(
        targetBbox,
        year
      );
      console.info('Antall bildepunkter returnert fra ogc: ' + imagePoints.length);
      if (imagePoints && imagePoints.length > 0) {
        setLoadedImagePoints({
          imagePoints: imagePoints,
          bbox: expandedBbox,
          year: year,
        });
        let nearestImagePoint;
        if (currentImagePoint) {
          nearestImagePoint = selectNearestImagePointToCurrentImagePoint(imagePoints, latlng);
        } else {
          nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng);
        }
        setIsFetching(false);
        if (nearestImagePoint) {
          handleFoundNearestImagePoint(nearestImagePoint, latlng);
        } else {
          showMessage(errorMessage);
          unsetCurrentImagePoint(); // if the user switch year and there are no images from that year, image point should be unset.
        }
      }
    } else {
      const nearestImagePoint = selectNearestImagePointToCoordinates(
        loadedImagePoints.imagePoints,
        latlng
      );
      setIsFetching(false);
      if (nearestImagePoint) {
        handleFoundNearestImagePoint(nearestImagePoint, latlng);
      }
    }
  }

  const handleFoundNearestImagePoint = (nearestImagePoint: IImagePoint, latlng: ILatlng) => {
    setCurrentImagePoint(nearestImagePoint);
    let zoom = currentCoordinates.zoom;
    if (!currentCoordinates.zoom || currentCoordinates.zoom < 15) {
      zoom = 15;
      setCurrentCoordinates({ latlng: latlng, zoom: zoom });
    }
  };

  const selectNearestImagePointToCoordinates = (imagePoints: IImagePoint[], latlng: ILatlng) => {
    if (!imagePoints || !imagePoints.length) return;
    const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, 300);
    if (nearestImagePoint) {
      return nearestImagePoint;
    }
  };

  const selectNearestImagePointToCurrentImagePoint = useCallback(
    (imagePoints: IImagePoint[], latlng: ILatlng) => {
      /* We want to find the nearest image point in the road reference of the current image point
       * (The actually nearest image point may be in the opposite lane, for example.)
       *
       * Note the use of a generic (year independent) road reference. This is sufficient here;
       * we are looking for a nearby image (by coordinates) on the same road, in the same lane.
       * (Strekning/hovedparsell does not really matter.) Note that even the generic road reference
       * is not necessarily stable from year to year, So we may not be able to find an image point
       * this way, or we may end up finding an image point in the opposite lane because the metering
       * direction of the road was changed, thus also changing the FELTKODE.
       */
      const sameRoadReferenceImagePoints = imagePoints.filter((imagePoint: IImagePoint) => {
        const roadRef = getGenericRoadReference(imagePoint);
        const currentRoadRef = getGenericRoadReference(currentImagePoint);
        return roadRef === currentRoadRef;
      });

      const nearestImagePoint = findNearestImagePoint(sameRoadReferenceImagePoints, latlng, 300);

      return nearestImagePoint;
    },
    [currentImagePoint]
  );

  return (latlng: ILatlng, year: number) => fetchImagePointsByYearAndLatLng(latlng, year);
};

export default useFetchNearestImagePoint;
