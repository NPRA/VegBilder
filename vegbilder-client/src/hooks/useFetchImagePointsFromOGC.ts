import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { imageType, IBbox, IImagePoint } from 'types';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loadedImagePointsFilterState } from 'recoil/selectors';
import { currentImagePointState } from 'recoil/atoms';
import { getNearestImagePointInSameDirectionOfImagePoint } from 'utilities/imagePointUtilities';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [loadedImagePoints, setLoadedImagePoints] = useRecoilState(loadedImagePointsFilterState);
  const currentImagePoint = useRecoilValue(currentImagePointState);

  async function fetchImagePointsByYearAndBbox(year: number, bbox: IBbox, imageType: imageType) {
    if (isFetching) return;
    setIsFetching(true);

    let typename =
    imageType === '360' ? `vegbilder_1_0:Vegbilder_360_${year}` : `vegbilder_1_0:Vegbilder_${year}`;

    const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(
      bbox,
      typename
    );
    console.info('Antall bildepunkter returnert fra ogc: ' + imagePoints.length);

    // If we have selected an imagepoint (currentImagePoint) and change imageType or year in filter, 
    // we want to remain in the imagePoint regardless of whether the current Bbox + new filter selection returns imagePoints
    // from the api. In this situation: to avoid updating the loadedImagePoints with new imagePoints (and thereby the map view) 
    // before we know the currentImagePoint has a corresponding image in the new filter selection, we do a check for a nearest imagePoint first.
    // (Sidenote: The check for nearest imagePoint is the same as in history view)
    // shouldCheckForNearest: We only want to check for nearest first when we have selected an imagePoint (currentImagePopint) 
    // and when imagetype or year is changed in the filter. In other situations, e.g. when
    // we have selected an imagePoint but click elsewhere on the map, we want to be able to search a wider area.

    const shouldFirstCheckForNearest = () => {
      if (loadedImagePoints && (loadedImagePoints.year !== year || loadedImagePoints.imageType !== imageType)) {
        return true;
      } else {
        return false;
      }
    }
    if (imagePoints && imagePoints.length > 0) {
      if (currentImagePoint && shouldFirstCheckForNearest()) {
        const nearestImagePointInSameDirection = getNearestImagePointInSameDirectionOfImagePoint(imagePoints, currentImagePoint);
          if (nearestImagePointInSameDirection) {
            setLoadedImagePoints({
              imagePoints: imagePoints,
              bbox: expandedBbox,
              year: year,
              imageType: imageType,
            });
            setIsFetching(false);
            return imagePoints as IImagePoint[];
          }
      } else {
        setLoadedImagePoints({
          imagePoints: imagePoints,
          bbox: expandedBbox,
          year: year,
          imageType: imageType,
        });
        setIsFetching(false);
        return imagePoints as IImagePoint[];
      }
    }
    setIsFetching(false);
  }

  return (year: number, bbox: IBbox, imageType: imageType) =>
    fetchImagePointsByYearAndBbox(year, bbox, imageType);
};

  export default useFetchImagePointsFromOGC;
