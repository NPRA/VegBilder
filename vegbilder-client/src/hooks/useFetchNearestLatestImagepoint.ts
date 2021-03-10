import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { currentYearState } from 'recoil/atoms';
import {
  availableYearsQuery,
  imagePointQueryParameterState,
  yearQueryParameterState,
} from 'recoil/selectors';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint } from 'utilities/latlngUtilities';
import useSetCurrentYear from './useSetCurrentYear';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string
) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  //const currentYear = useRecoilValue(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const [, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  //const setCurrentYear = useSetCurrentYear();
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    if (isFetching) return;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      setIsFetching(true);
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
            const year = nearestImagePoint.properties.AAR;
            setCurrentImagePoint(nearestImagePoint);
            setCurrentYear(year);
            let zoom = currentCoordinates.zoom;
            if (!currentCoordinates.zoom || currentCoordinates.zoom < 15) {
              zoom = 15;
              setCurrentCoordinates({ latlng: latlng, zoom: zoom });
            }
            showMessage(
              `Avslutter nyeste og viser bilder fra ${year}, som er det året med de nyeste bildene i området.`
            );
            foundImage = true;
            break;
          }
        }
      }
      if (!foundImage) {
        setIsFetching(false);
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

  return (latlng: ILatlng) => fetchImagePointsFromNewestYearByLatLng(latlng);
};

export default useFetchNearestLatestImagePoint;
