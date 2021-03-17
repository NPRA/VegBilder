import { useState, useCallback } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import {
  availableYearsQuery,
  imagePointQueryParameterState,
  latLngQueryParameterState,
  yearQueryParameterState,
} from 'recoil/selectors';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint, getImagePointLatLng } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint } from 'utilities/latlngUtilities';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string
) => {
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngQueryParameterState);
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(showMessage);

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    if (isFetching) return;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      setIsFetching(true);
      const targetBbox = createSquareBboxAroundPoint(latlng, settings.targetBboxSize);
      let foundImage = false;
      for (const year of availableYears) {
        const imagePoints_ = await fetchImagePointsByLatLongAndYear(latlng, year);
        if (imagePoints_) {
          break;
        }
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
            const imagePointCoordinates = getImagePointLatLng(nearestImagePoint);
            if (!currentCoordinates.zoom || currentCoordinates.zoom < 15) {
              if (imagePointCoordinates)
                setCurrentCoordinates({ ...imagePointCoordinates, zoom: 15 });
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
      const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, 1000);
      if (nearestImagePoint) {
        return nearestImagePoint;
      }
    },
    [currentCoordinates]
  );

  return (latlng: ILatlng) => fetchImagePointsFromNewestYearByLatLng(latlng);
};

export default useFetchNearestLatestImagePoint;
