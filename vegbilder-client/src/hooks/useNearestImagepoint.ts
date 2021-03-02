import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import useQueryParamState from 'hooks/useQueryParamState';
import { useState, useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentYearState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint } from 'utilities/latlngUtilities';

const useNearestImagePoint = (showMessage: (message: string) => void, notFoundMessage: string) => {
  const { currentCoordinates } = useCurrentCoordinates();
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const { setCurrentImagePoint } = useCurrentImagePoint();
  const [, setQueryParamYear] = useQueryParamState('year');
  const [nearestImagePoint, setNearestImagePoint] = useState<IImagePoint | null>(null);

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    if (isFetching) return;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      const targetBbox = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
      let foundImage = false;
      for (const year of availableYears) {
        const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(
          targetBbox,
          year
        );
        if (imagePoints && imagePoints.length > 0) {
          setLoadedImagePoints({
            imagePoints: imagePoints,
            bbox: expandedBbox,
            year: year,
          });
          const nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng);
          setIsFetching(false);
          if (nearestImagePoint) {
            setNearestImagePoint(nearestImagePoint);
            const year = nearestImagePoint.properties.AAR;
            setCurrentImagePoint(nearestImagePoint);
            setCurrentYear(year);
            setQueryParamYear(year.toString());
            showMessage(
              `Setter årstallet til ${year}, som er det året med de nyeste bildene i området.`
            );
            foundImage = true;
            break;
          }
        }
      }
      if (!foundImage) {
        showMessage(notFoundMessage);
      }
    }
  }

  const selectNearestImagePointToCoordinates = useCallback(
    (imagePoints: IImagePoint[], latlng) => {
      if (!imagePoints || !imagePoints.length || !currentCoordinates) return;
      const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, 300);
      if (nearestImagePoint) {
        return nearestImagePoint;
      }
    },
    [currentCoordinates]
  );

  useEffect(() => {
    fetchImagePointsFromNewestYearByLatLng(currentCoordinates.latlng);
  }, [currentCoordinates]);

  return nearestImagePoint;
};

export default useNearestImagePoint;
