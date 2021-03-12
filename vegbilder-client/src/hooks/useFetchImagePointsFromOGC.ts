import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { ILatlng } from 'types';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();

  async function fetchImagePointsByYearAndLatLng(latlng: ILatlng, year: number) {
    if (isFetching) return;
    const bboxVisibleMapArea = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox);
    if (shouldFetchNewImagePointsFromOGC) {
      setIsFetching(true);
      const targetBbox = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
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
        return imagePoints;
      }
    }
  }
  return (latlng: ILatlng, year: number) => fetchImagePointsByYearAndLatLng(latlng, year);
};

export default useFetchImagePointsFromOGC;
