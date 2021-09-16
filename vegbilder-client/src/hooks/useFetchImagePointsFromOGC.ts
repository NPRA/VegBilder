import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { cameraTypes, IBbox, IImagePoint } from 'types';
import { useSetRecoilState } from 'recoil';
import { loadedImagePointsFilterState } from 'recoil/selectors';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const setLoadedImagePoints = useSetRecoilState(loadedImagePointsFilterState);

  async function fetchImagePointsByYearAndBbox(year: number, bbox: IBbox, cameraType: cameraTypes) {
    if (isFetching) return;
    setIsFetching(true);

    let typename =
      cameraType === '360' ? `vegbilder_1_0:Vegbilder_360_${year}` : `vegbilder_1_0:Vegbilder_${year}`;

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
        cameraType: cameraType,
      });
      setIsFetching(false);
      return imagePoints as IImagePoint[];
    }
    setIsFetching(false);
  }

  return (year: number, bbox: IBbox, cameraType: cameraTypes) =>
    fetchImagePointsByYearAndBbox(year, bbox, cameraType);
};

export default useFetchImagePointsFromOGC;
