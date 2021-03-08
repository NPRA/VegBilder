import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { useState, useCallback } from 'react';
import { ILatlng, IImagePoint } from 'types';
import { useLeafletBounds, useLeafletCenter } from 'use-leaflet';
import { findNearestImagePoint } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';

const useFetchNearestImagePoint = (showMessage: (message: string) => void) => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const { currentCoordinates } = useCurrentCoordinates();
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const { setCurrentImagePoint } = useCurrentImagePoint();

  const createBboxForVisibleMapArea = useCallback(() => {
    // Add some padding to the bbox because the meridians do not perfectly align with the vertical edge of the screen (projection issues)
    let paddingX = (east - west) * 0.1;
    let paddingY = (north - south) * 0.1;
    if (settings.debugMode) {
      // Simulate a smaller visible map area for debugging purposes.
      paddingX = (west - east) * 0.2;
      paddingY = (south - north) * 0.2;
    }
    return {
      south: south - paddingY,
      west: west - paddingX,
      north: north + paddingY,
      east: east + paddingX,
    };
  }, [south, west, north, east]);

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng, year: number) {
    if (isFetching) return;
    const bboxVisibleMapArea = createBboxForVisibleMapArea();
    if (
      !loadedImagePoints ||
      loadedImagePoints.year !== year ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
    ) {
      setIsFetching(true);
      const targetBbox = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
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
          setCurrentImagePoint(nearestImagePoint);
        } else {
          setIsFetching(false);
          showMessage(
            'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
          );
        }
      }
    } else {
      const nearestImagePoint = selectNearestImagePointToCoordinates(
        loadedImagePoints.imagePoints,
        latlng
      );
      setIsFetching(false);
      if (nearestImagePoint) {
        setCurrentImagePoint(nearestImagePoint);
      }
    }
  }

  const selectNearestImagePointToCoordinates = (imagePoints: IImagePoint[], latlng: ILatlng) => {
    if (!imagePoints || !imagePoints.length) return;
    const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, 300);
    if (nearestImagePoint) {
      return nearestImagePoint;
    }
  };

  return (latlng: ILatlng, year: number) => fetchImagePointsFromNewestYearByLatLng(latlng, year);
};

export default useFetchNearestImagePoint;
