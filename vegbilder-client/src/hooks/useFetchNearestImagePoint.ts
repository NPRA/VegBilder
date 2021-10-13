import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { find } from 'lodash';

import { settings } from 'constants/settings';
import { ILatlng, IImagePoint, imageType } from 'types';
import {
  findNearestImagePoint,
  getGenericRoadReference,
  getImagePointLatLng,
} from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';
import { imagePointQueryParameterState, latLngZoomQueryParameterState, viewQueryParamterState } from 'recoil/selectors';
import useFetchImagePointsFromOGC from './useFetchImagePointsFromOGC';
import { loadedImagePointsState } from 'recoil/atoms';

type fetchMethod = 'default' | 'findByImageId' | 'findImageNearbyCurrentImagePoint' | 'zoomInOnImages' | 'findImagePointWithCustomRadius';

const useFetchNearestImagePoint = (
  showMessage: (message: string, duration?: number) => void,
  errorMessage = 'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.',
  fetchMethod: fetchMethod = 'default',
) => {
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);

  const fetchImagePointsFromOGC = useFetchImagePointsFromOGC();

  async function fetchImagePointsByYearAndLatLng(latlng: ILatlng, year: number, imageType: imageType, searchRadius?: number) {
    const bboxVisibleMapArea = createSquareBboxAroundPoint(latlng, settings.targetBboxSize);
    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox) ||
      loadedImagePoints.imageType !== imageType;
    if (shouldFetchNewImagePointsFromOGC) {
      showMessage(`Leter etter bilder i ${year}...`);
      fetchImagePointsFromOGC(year, bboxVisibleMapArea, imageType).then((imagePoints: IImagePoint[] | undefined) => {
        if (imagePoints && imagePoints.length) {
          let nearestImagePoint;
          if (fetchMethod === 'findByImageId') {
            nearestImagePoint = findImagePointByQueryId(imagePoints);
          } else if (currentImagePoint && fetchMethod === 'findImageNearbyCurrentImagePoint') {
            nearestImagePoint = selectNearestImagePointToCurrentImagePoint(imagePoints, latlng);
          } else if (fetchMethod === 'findImagePointWithCustomRadius' && searchRadius) {
            nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng, searchRadius);
          } else {
            nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng, 1000);
          }
          if (nearestImagePoint) {
            handleFoundNearestImagePoint(nearestImagePoint);
            return nearestImagePoint;
          } else {
            showMessage(errorMessage);
            setCurrentImagePoint(null); // if the user switch year and there are no images from that year, image point should be unset.
          }
        } else {
          if (currentImagePoint) {
            setCurrentImagePoint(null);  //If an imagepoint is selected and the next call to fetch imagePoints returns undefined the imagepoint should be reset.
          }
          showMessage(errorMessage);
        }
      })
    } else {
      if (loadedImagePoints) {
        const nearestImagePoint = selectNearestImagePointToCoordinates(
          loadedImagePoints.imagePoints,
          latlng,
          1000
        );
        if (nearestImagePoint) {
          handleFoundNearestImagePoint(nearestImagePoint);
          return nearestImagePoint;
        }
      }
    }
  }

  const handleFoundNearestImagePoint = (nearestImagePoint: IImagePoint) => {
    setCurrentImagePoint(nearestImagePoint);
    const imagePointCoordinates = getImagePointLatLng(nearestImagePoint);
    if (!currentCoordinates.zoom || currentCoordinates.zoom < 15) {
      if (imagePointCoordinates) {
        const newCoordinates = { ...imagePointCoordinates, zoom: 15 };
        setCurrentCoordinates(newCoordinates);
      } // center map on the image we found
    }
  };

  const selectNearestImagePointToCoordinates = (imagePoints: IImagePoint[], latlng: ILatlng, maxDistanceAwayInMeters: number) => {
    if (!imagePoints || !imagePoints.length) return;
    const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, maxDistanceAwayInMeters);
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
        if (currentImagePoint) {
          const roadRef = getGenericRoadReference(imagePoint);
          const currentRoadRef = getGenericRoadReference(currentImagePoint);
          return roadRef === currentRoadRef;
        }
        return true;
      });
      const nearestImagePoint = findNearestImagePoint(sameRoadReferenceImagePoints, latlng, 300);

      return nearestImagePoint;
    },
    [currentImagePoint]
  );

  const findImagePointByQueryId = (imagePoints: IImagePoint[]) => {
    const searchParams = new URLSearchParams(window.location.search);
    const currentImageId = searchParams.get('imageId');
    if (imagePoints && imagePoints.length && currentImageId) {
      const imagePoint = find(imagePoints, (imagePoint) => imagePoint.id === currentImageId);
      return imagePoint;
    }
  };

  return (latlng: ILatlng, year: number, imageType: imageType, searchRadius?: number) =>
    fetchImagePointsByYearAndLatLng(latlng, year, imageType, searchRadius);
};

export default useFetchNearestImagePoint;
