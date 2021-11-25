import { useState } from 'react';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { IBbox, IImagePoint } from 'types';
import { useRecoilValue, useRecoilState } from 'recoil';
import { loadedImagePointsFilterState, availableYearsQuery } from 'recoil/selectors';
import { currentImagePointState } from 'recoil/atoms';
import { getNearestImagePointInSameDirectionOfImagePoint } from 'utilities/imagePointUtilities';

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


    let imagePointsAll: IImagePoint[] = [];
    let imagePointsPlanar: IImagePoint[] = [];
    let imagePointsPanorama: IImagePoint[] = [];
    let expandedBbox: any = {};

      let resPlanar: any = {};
      let res360: any = {};

      if (imageTypeHasImagesForYear('planar', year)) {
        resPlanar = await getImagePointsInTilesOverlappingBbox(bbox, `vegbilder_1_0:Vegbilder_${year}`);
      }
      if (imageTypeHasImagesForYear('panorama', year)) {
        res360 = await getImagePointsInTilesOverlappingBbox(bbox, `vegbilder_1_0:Vegbilder_360_${year}`);
      }

      imagePointsPlanar = resPlanar.imagePoints ?? [];
      imagePointsPanorama = res360.imagePoints ?? [];
      imagePointsAll = [...imagePointsPlanar, ...imagePointsPanorama];

      expandedBbox = res360.expandedBbox ?? resPlanar.expandedBbox; //expandedBbox is identical for both results.

      console.info('Antall bildepunkter returnert fra ogc: ' + imagePointsAll.length);

    // If we have selected an imagepoint (currentImagePoint) and change imageType or year in filter, 
    // we want to remain in the imagePoint regardless of whether the current Bbox + new filter selection returns imagePoints
    // from the api. In this situation: to avoid updating the loadedImagePoints with new imagePoints (and thereby the map view) 
    // before we know the currentImagePoint has a corresponding image in the new filter selection, we do a check for a nearest imagePoint first.
    // (Sidenote: The check for nearest imagePoint is the same as in history view)
    // shouldCheckForNearest: We only want to check for nearest first when we have selected an imagePoint (currentImagePopint) 
    // and when imagetype or year is changed in the filter. In other situations, e.g. when
    // we have selected an imagePoint but click elsewhere on the map, we want to be able to search a wider area.

    const shouldFirstCheckForNearest = () => {
      if (loadedImagePoints && (loadedImagePoints.year !== year)) {
        return true;
      } else {
        return false;
      }
    }
    if (imagePointsAll && imagePointsAll.length > 0) {
      if (currentImagePoint && shouldFirstCheckForNearest()) {
        const nearestImagePointInSameDirection = getNearestImagePointInSameDirectionOfImagePoint(imagePointsAll, currentImagePoint);
          if (nearestImagePointInSameDirection) {
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
