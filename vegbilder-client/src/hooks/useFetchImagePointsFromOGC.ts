import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { IBbox } from 'types';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const { setLoadedImagePoints } = useLoadedImagePoints();

  async function fetchImagePointsByYearAndLatLng(year: number, bbox: IBbox) {
    if (isFetching) return;
    setIsFetching(true);
    const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(bbox, year);
    console.info('Antall bildepunkter returnert fra ogc: ' + imagePoints.length);
    if (imagePoints && imagePoints.length > 0) {
      setLoadedImagePoints({
        imagePoints: imagePoints,
        bbox: expandedBbox,
        year: year,
      });
      setIsFetching(false);
      return imagePoints;
    }
  }

  return (year: number, bbox: IBbox) => fetchImagePointsByYearAndLatLng(year, bbox);
};

export default useFetchImagePointsFromOGC;