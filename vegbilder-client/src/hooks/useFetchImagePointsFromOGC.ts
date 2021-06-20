import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { IBbox } from 'types';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { loadedImagePointsFilterState } from 'recoil/selectors';
import { cameraFilterState } from 'recoil/atoms';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const setLoadedImagePoints = useSetRecoilState(loadedImagePointsFilterState);
  const cameraFilter = useRecoilValue(cameraFilterState);

  async function fetchImagePointsByYearAndBbox(year: number, bbox: IBbox) {
    if (isFetching) return;
    setIsFetching(true);
    const typename =
      cameraFilter === 'panorama'
        ? `vegbilder_1_0:Vegbilder_360_2021`
        : `vegbilder_1_0:Vegbilder_${year}`;
    const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(
      bbox,
      typename
    );
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
