import { useCallback } from 'react';
import { useRecoilState } from 'recoil';
import { find } from 'lodash';

import { settings } from 'constants/constants';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint, getGenericRoadReference } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';
import {
  imagePointQueryParameterState,
  latLngQueryParameterState,
  zoomQueryParameterState,
} from 'recoil/selectors';
import useFetchImagePointsFromOGC from './useFetchImagePointsFromOGC';

type action = 'default' | 'findByImageId';

const useFetchNearestImagePoint = (
  showMessage: (message: string) => void,
  errorMessage = 'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.',
  action: action = 'default'
) => {
  const { loadedImagePoints } = useLoadedImagePoints();
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [, setCurrentCoordinates] = useRecoilState(latLngQueryParameterState);
  const [currentZoom, setCurrentZoom] = useRecoilState(zoomQueryParameterState);

  const fetchImagePointsFromOGC = useFetchImagePointsFromOGC();

  async function fetchImagePointsByYearAndLatLng(latlng: ILatlng, year: number) {
    const bboxVisibleMapArea = createSquareBboxAroundPoint(latlng, settings.targetBboxSize);
    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox);
    if (shouldFetchNewImagePointsFromOGC) {
      fetchImagePointsFromOGC(year, bboxVisibleMapArea).then((imagePoints) => {
        if (imagePoints && imagePoints.length > 0) {
          let nearestImagePoint;
          if (action === 'findByImageId') {
            nearestImagePoint = findImagePointByQueryId(imagePoints);
          } else if (currentImagePoint && action === 'default') {
            nearestImagePoint = selectNearestImagePointToCurrentImagePoint(imagePoints, latlng);
          } else {
            nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng);
          }
          if (nearestImagePoint) {
            handleFoundNearestImagePoint(nearestImagePoint, latlng);
          } else {
            showMessage(errorMessage);
            setCurrentImagePoint(null); // if the user switch year and there are no images from that year, image point should be unset.
          }
        }
      });
    } else {
      const nearestImagePoint = selectNearestImagePointToCoordinates(
        loadedImagePoints.imagePoints,
        latlng
      );
      if (nearestImagePoint) {
        handleFoundNearestImagePoint(nearestImagePoint, latlng);
      }
    }
  }

  const handleFoundNearestImagePoint = (nearestImagePoint: IImagePoint, latlng: ILatlng) => {
    setCurrentImagePoint(nearestImagePoint);
    if (!currentZoom || currentZoom < 15) {
      setCurrentZoom(15);
      setCurrentCoordinates(latlng);
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

  return (latlng: ILatlng, year: number) => fetchImagePointsByYearAndLatLng(latlng, year);
};

export default useFetchNearestImagePoint;
