import React, { useEffect, useState, useCallback } from 'react';
import { Icon } from 'leaflet';
import { useLeafletBounds, useLeafletCenter } from 'use-leaflet';
import { Rectangle, Marker } from 'react-leaflet';
import leafletrotatedmarker from 'leaflet-rotatedmarker'; // Your IDE may report this as unused, but it is required for the rotationAngle property of Marker to work
import { useRecoilValue } from 'recoil';

import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import {
  createSquareBboxAroundPoint,
  isWithinBbox,
  isBboxWithinContainingBbox,
} from 'utilities/latlngUtilities';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import {
  getImagePointLatLng,
  findNearestImagePoint,
  getGenericRoadReference,
} from 'utilities/imagePointUtilities';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { currentYearState, playVideoState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';

const settings = {
  targetBboxSize: 2000, // Will be used as the size of the bbox for fetching image points if the map bounds are not used (decided by shouldUseMapBoundsAsTargetBbox prop)
  debugMode: false,
};

const ImagePointsLayer = ({ shouldUseMapBoundsAsTargetBbox }) => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const [targetBbox, setTargetBbox] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  const { filteredImagePoints } = useFilteredImagePoints();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { currentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const year = useRecoilValue(currentYearState);
  const { command, resetCommand } = useCommand();
  const playVideo = useRecoilValue(playVideoState);
  const availableYears = useRecoilValue(availableYearsQuery);

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

  const selectNearestImagePointToCurrentCoordinates = useCallback(() => {
    if (!filteredImagePoints || !currentCoordinates) return false;
    const nearestImagePoint = findNearestImagePoint(filteredImagePoints, currentCoordinates.latlng);
    if (nearestImagePoint) {
      setCurrentImagePoint(nearestImagePoint);
    }
    return true;
  }, [filteredImagePoints, currentCoordinates, setCurrentImagePoint]);

  const selectNearestImagePointToCurrentImagePoint = useCallback(() => {
    if (!filteredImagePoints) return false;
    if (!currentImagePoint) return true;
    /* We want to find the nearest image point in the road reference of the current image point
     * (The actually nearest image point may be in the opposite lane, for example.)
     *
     * Note the use of a generic (year independent) road reference. This is sufficient here;
     * we are looking for a nearby image (by coordinates) on the same road, in the same lane.
     * (Strekning/hovedparsell does not really matter.) Note that even the generic road reference
     * is not necessarily stable from year to year, So we may not be able to find an image point
     * this way, or we may end up finding an image point in the opposite lane because the metering
     * direction of the road was changed, thus also changing the FELTKODE.
     */
    const sameRoadReferenceImagePoints = filteredImagePoints.filter((ip) => {
      const roadRef = getGenericRoadReference(ip);
      const currentRoadRef = getGenericRoadReference(currentImagePoint);
      return roadRef === currentRoadRef;
    });

    const nearestImagePoint = findNearestImagePoint(
      sameRoadReferenceImagePoints,
      getImagePointLatLng(currentImagePoint)
    );
    setCurrentImagePoint(nearestImagePoint);
    return true;
  }, [filteredImagePoints, currentImagePoint, setCurrentImagePoint]);

  /* Fetch image points in new target area whenever the map bounds exceed the currently fetched area
   * or user has selected a new year.
   */
  useEffect(() => {
    (async () => {
      const bboxVisibleMapArea = createBboxForVisibleMapArea();
      if (isFetching) return;
      if (
        !loadedImagePoints ||
        loadedImagePoints.year !== year ||
        !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
      ) {
        setIsFetching(true);
        const [lat, lng] = mapCenter;
        let targetBbox;
        if (shouldUseMapBoundsAsTargetBbox) {
          targetBbox = bboxVisibleMapArea;
        } else {
          targetBbox = createSquareBboxAroundPoint({ lat, lng }, settings.targetBboxSize);
        }
        const {
          imagePoints,
          expandedBbox,
          fetchedBboxes,
        } = await getImagePointsInTilesOverlappingBbox(targetBbox, year);
        setLoadedImagePoints({
          imagePoints: imagePoints,
          bbox: expandedBbox,
          year: year,
        });
        setFetchedBboxes(fetchedBboxes);
        setTargetBbox(targetBbox);
        setIsFetching(false);
      }
    })();
  }, [
    mapCenter,
    loadedImagePoints,
    year,
    isFetching,
    createBboxForVisibleMapArea,
    shouldUseMapBoundsAsTargetBbox,
    setLoadedImagePoints,
  ]);

  // Apply command if present
  useEffect(() => {
    let commandWasExecuted = false;
    switch (command) {
      case commandTypes.selectNearestImagePointToCurrentCoordinates:
        /* Attempt to select the image point nearest to the current coordinates. This is done
         * after a search for vegsystemreferanse in the Search component, but there may
         * also be other uses for it. It is possible that there are no loaded image points,
         * so that no nearest image point can be found. In that case, the command should
         * not be reset, as we want to rerun it on the next render, which may be triggered
         * by loadedImagePoints being populated.
         */
        commandWasExecuted = selectNearestImagePointToCurrentCoordinates();
        break;
      case commandTypes.selectNearestImagePointToCurrentImagePoint:
        /* Attempt to select the image point nearest to the current image point, in the same
         * road reference (ie. the same lane) as the current image point. This is done after
         * switching year or image series within a year.
         */
        commandWasExecuted = selectNearestImagePointToCurrentImagePoint();
        break;
      default:
      // Any other commands do not apply to this component and will be ignored
    }
    if (commandWasExecuted) {
      resetCommand();
    }
  }, [
    command,
    resetCommand,
    selectNearestImagePointToCurrentCoordinates,
    selectNearestImagePointToCurrentImagePoint,
  ]);

  const imagePointIsWithinBbox = (imagePoint, bbox) => {
    const latlng = getImagePointLatLng(imagePoint);
    return isWithinBbox(latlng, bbox);
  };

  const getMarkerIcon = (vegkategori, isDirectional, isSelected) => {
    const iconUrl = `images/markers/marker-${
      vegkategori === 'E' || vegkategori === 'R' ? 'ER' : 'FK'
    }-${year === availableYears[0] ? 'newest' : 'older'}-${
      isDirectional ? 'directional' : 'nondirectional'
    }${isSelected ? '-selected' : ''}.svg`;
    let iconSizeX, iconSizeY;

    if (isDirectional) {
      iconSizeX = isSelected ? 21 : 15;
      iconSizeY = isSelected ? 35 : 25;
    } else {
      iconSizeX = isSelected ? 14 : 10;
      iconSizeY = iconSizeX;
    }
    if (currentCoordinates.zoom < 16) {
      iconSizeX *= 0.8;
      iconSizeY *= 0.8;
    }

    const iconSize = [iconSizeX, iconSizeY];
    const iconAnchor = [iconSizeX / 2, iconSizeY / 2];
    return new Icon({
      iconUrl: iconUrl,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
    });
  };

  const renderImagePoints = () => {
    if (filteredImagePoints) {
      const mapBbox = createBboxForVisibleMapArea();
      const imagePointsToRender = filteredImagePoints.filter((imagePoint) =>
        imagePointIsWithinBbox(imagePoint, mapBbox)
      );
      return (
        <>
          {imagePointsToRender.map((imagePoint) => {
            const latlng = getImagePointLatLng(imagePoint);
            const isDirectional = imagePoint.properties.RETNING != null;
            const isSelected = currentImagePoint && currentImagePoint.id === imagePoint.id;
            const icon = getMarkerIcon(
              imagePoint.properties.VEGKATEGORI,
              isDirectional,
              isSelected
            );
            return (
              <Marker
                key={imagePoint.id}
                position={latlng}
                icon={icon}
                rotationAngle={imagePoint.properties.RETNING}
                rotationOrigin={'center center'}
                zIndexOffset={isSelected ? 10000 : 0}
                onclick={() => {
                  if (!playVideo) {
                    setCurrentImagePoint(imagePoint);
                  }
                  //setCurrentCoordinates({ latlng: latlng, zoom: zoom });
                }}
              />
            );
          })}
        </>
      );
    }
  };

  const renderBbox = (bbox, color) => {
    if (bbox) {
      return (
        <Rectangle
          key={`${bbox.south}${bbox.west}${bbox.north}${bbox.east}`}
          bounds={[
            [bbox.south, bbox.west],
            [bbox.north, bbox.east],
          ]}
          color={color}
        />
      );
    }
  };

  const renderTargetBbox = () => {
    return renderBbox(targetBbox, 'red');
  };

  const renderFetchBboxes = () => {
    if (fetchedBboxes) {
      return <>{fetchedBboxes.map((bbox) => renderBbox(bbox, 'blue'))}</>;
    }
  };

  const renderLoadedBbox = () => {
    // This bbox should correspond to the union of the fetchBboxes, so it will generelly not be visible
    if (loadedImagePoints) {
      return renderBbox(loadedImagePoints.bbox, 'orange');
    }
  };

  const renderMapAreaBbox = () => {
    const bbox = createBboxForVisibleMapArea();
    return renderBbox(bbox, 'green');
  };

  const renderBboxes = () => {
    return (
      <>
        {renderTargetBbox()}
        {renderMapAreaBbox()}
        {renderFetchBboxes()}
        {renderLoadedBbox()}
      </>
    );
  };

  return (
    <>
      {settings.debugMode ? renderBboxes() : null}
      {renderImagePoints()}
    </>
  );
};

export default ImagePointsLayer;
