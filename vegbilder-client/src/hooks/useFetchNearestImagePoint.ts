import { useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { find } from 'lodash';

import { settings } from 'constants/settings';
import { ILatlng, IImagePoint } from 'types';
import {
  findNearestImagePoint,
  getGenericRoadReference,
  getImagePointLatLng,
} from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';
import { imagePointQueryParameterState, latLngZoomQueryParameterState, yearQueryParameterState } from 'recoil/selectors';
import { loadedImagePointsState, currentViewState } from 'recoil/atoms';
import useFetchImagePointsFromOGC from './useFetchImagePointsFromOGC';

// FETCH METHODS:
// Default = Find and return the nearest image point within a 1000m radius.
// findByImageId = Find and return an image point based on imageID (imageID in url).
// findImageNearbyCurrentImagePoint = Find and return the nearest image point with the same road reference (inluding Felt) within 300m.
// findImagePointWithCustomRadius = Find and return the nearest image point within a custom radius. Used to give external services
//                                  the ability to customize their search (e.g. Vegkart).

type fetchMethod = 'default' | 'findByImageId' | 'findImageNearbyCurrentImagePoint' | 'findImagePointWithCustomRadius';

const useFetchNearestImagePoint = (
  showMessage: (message: string, duration?: number) => void,
  errorMessage = 'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.',
  fetchMethod: fetchMethod = 'default',
) => {
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const currentView = useRecoilValue(currentViewState);

  const fetchImagePointsFromOGC = useFetchImagePointsFromOGC();

  async function fetchImagePointsByYearAndLatLng(latlng: ILatlng, year: number, searchRadius?: number) {
    const bboxVisibleMapArea = createSquareBboxAroundPoint(latlng, settings.targetBboxSize);

    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)

    if (shouldFetchNewImagePointsFromOGC) {
      showMessage(`Leter etter bilder i ${year}...`);
      fetchImagePointsFromOGC(year, bboxVisibleMapArea).then((imagePoints: IImagePoint[] | undefined) => {
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
            handleFoundNearestImagePoint(nearestImagePoint, year);
            return nearestImagePoint;
          } else {
            showMessage(errorMessage);
          }
        } else {
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
          handleFoundNearestImagePoint(nearestImagePoint, year);
          return nearestImagePoint;
        }
      }
    }
  }

  const handleFoundNearestImagePoint = (nearestImagePoint: IImagePoint, currentYear: number) => {
    setCurrentImagePoint(nearestImagePoint);
    setCurrentYear(currentYear);
    const imagePointCoordinates = getImagePointLatLng(nearestImagePoint);
    if (imagePointCoordinates) {
      let newCoordinates = {...imagePointCoordinates, zoom: 15};
      if (!currentCoordinates.zoom || currentCoordinates.zoom < 15) {
        newCoordinates = { ...imagePointCoordinates, zoom: 15 };
      } 
      if (currentView === 'image') {
        newCoordinates = { ...imagePointCoordinates, zoom: 16 };
      }
      setCurrentCoordinates(newCoordinates);
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

  return (latlng: ILatlng, year: number, searchRadius?: number) =>
    fetchImagePointsByYearAndLatLng(latlng, year, searchRadius);
};

export default useFetchNearestImagePoint;
