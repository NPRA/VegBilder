import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { IBbox, ILatlng } from 'types';
import { isBboxWithinContainingBbox } from 'utilities/latlngUtilities';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();

  async function fetchImagePointsByYearAndLatLng(latlng: ILatlng, year: number, bbox: IBbox) {
    if (isFetching) return;
    const shouldFetchNewImagePointsFromOGC =
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bbox, loadedImagePoints.bbox);
    if (shouldFetchNewImagePointsFromOGC) {
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
  }
  return (latlng: ILatlng, year: number, bbox: IBbox) =>
    fetchImagePointsByYearAndLatLng(latlng, year, bbox);
};

export default useFetchImagePointsFromOGC;
