import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { IBbox } from 'types';
import { useSetRecoilState } from 'recoil';
import { loadedImagePointsFilterState } from 'recoil/selectors';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const setLoadedImagePoints = useSetRecoilState(loadedImagePointsFilterState);

  async function fetchImagePointsByYearAndBbox(year: number, bbox: IBbox) {
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
    setIsFetching(false);
  }

  return (year: number, bbox: IBbox) => fetchImagePointsByYearAndBbox(year, bbox);
};

export default useFetchImagePointsFromOGC;
