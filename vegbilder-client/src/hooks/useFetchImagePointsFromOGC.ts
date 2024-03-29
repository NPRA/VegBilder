import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';

import { loadedImagePointsFilterState, availableYearsQuery } from 'recoil/selectors';
import { currentImagePointState } from 'recoil/atoms';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { IBbox, IImagePoint } from 'types';
import { getNearestImagePointToCurrentImagePoint } from 'utilities/imagePointUtilities';

const useFetchImagePointsFromOGC = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [loadedImagePoints, setLoadedImagePoints] = useRecoilState(loadedImagePointsFilterState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);

  const imageTypeHasImagesForYear = (imageType: string, year: number) => {
    return availableYearsForAllImageTypes[imageType].includes(year);
  }

  async function fetchImagePointsByYearAndBbox(year: number, bbox: IBbox) {
    if (isFetching) return;
    setIsFetching(true);

      const resPlanar: any = imageTypeHasImagesForYear('planar', year) 
        ? await getImagePointsInTilesOverlappingBbox(bbox, `vegbilder_1_0:Vegbilder_${year}`) 
        : {};

      const res360: any = imageTypeHasImagesForYear('panorama', year) 
        ? await getImagePointsInTilesOverlappingBbox(bbox, `vegbilder_1_0:Vegbilder_360_${year}`) 
        : {};

      const imagePointsPlanar = resPlanar.imagePoints ?? [];
      const imagePointsPanorama = res360.imagePoints ?? [];
      // Currently, all possible image types are panorama (360) and planar, but dekkekamera might be implemented in the future.
      const imagePointsAll: IImagePoint[] = [...imagePointsPlanar, ...imagePointsPanorama]; 

      const expandedBbox = res360.expandedBbox ?? resPlanar.expandedBbox; //expandedBbox is identical for both results.

      console.info('Antall bildepunkter returnert fra ogc: ' + imagePointsAll.length);

    /*
       If we have selected an image point (currentImagePoint) and change year in filter, 
       we want to remain in the imagePoint regardless of whether the current Bbox + new filter selection returns imagePoints
       from the api. In this situation: to avoid updating the loadedImagePoints with new imagePoints (and thereby the map view) 
       before we know the currentImagePoint has a corresponding image in the new filter selection, we do a check for a nearest imagePoint first.
       shouldCheckForNearest: We only want to check for nearest first when we have selected an imagePoint (currentImagePopint) 
       and when imagetype or year is changed in the filter. In other situations, e.g. when
       we have selected an imagePoint but click elsewhere on the map, we want to be able to search a wider area.
    */
    const shouldFirstCheckForNearest = () => loadedImagePoints && (loadedImagePoints.year !== year);

    if (imagePointsAll && imagePointsAll.length > 0) {
      if (currentImagePoint && shouldFirstCheckForNearest()) {
        const nearestImagePointToCurrentImagePoint = getNearestImagePointToCurrentImagePoint(imagePointsAll, currentImagePoint);
          if (nearestImagePointToCurrentImagePoint) {
            setLoadedImagePoints({
              imagePoints: imagePointsAll,
              bbox: expandedBbox,
              year: year,
            });
            setIsFetching(false);
            return imagePointsAll as IImagePoint[];
          }
      } else {
        setLoadedImagePoints({
          imagePoints: imagePointsAll,
          bbox: expandedBbox,
          year: year,
        });
        setIsFetching(false);
        return imagePointsAll as IImagePoint[];
      }
    }
    setIsFetching(false);
  }

  return (year: number, bbox: IBbox) =>
    fetchImagePointsByYearAndBbox(year, bbox);
};

  export default useFetchImagePointsFromOGC;
