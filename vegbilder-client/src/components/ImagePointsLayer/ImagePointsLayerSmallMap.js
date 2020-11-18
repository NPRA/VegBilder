import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "leaflet";
import {
  useLeafletBounds,
  useLeafletCenter,
  useLeafletZoom,
} from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";
import leafletrotatedmarker from "leaflet-rotatedmarker"; // Your linter may report this as unused, but it is required for the rotationAngle property of Marker to work

import getImagePointsInTilesOverlappingBbox from "../../apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox";
import {
  createSquareBboxAroundPoint,
  isWithinBbox,
  isBboxWithinContainingBbox,
} from "../../utilities/latlngUtilities";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { timePeriods, useTimePeriod } from "../../contexts/TimePeriodContext";
import { getImagePointLatLng } from "../../utilities/imagePointUtilities";

const settings = {
  targetBboxSize: 2000,
  debugMode: false,
};

const ImagePointsLayerSmallMap = () => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const zoom = useLeafletZoom();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const [targetBbox, setTargetBbox] = useState(null);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const { timePeriod } = useTimePeriod();

  const createBboxForVisibleMapArea = useCallback(() => {
    // Add some padding to the bbox because the meridians do not perfectly align with the vertical edge of the screen (projection issues)
    let paddingX = (east - west) * 0.1;
    let paddingY = (north - south) * 0.1;
    if (settings.debugMode) {
      // Simulate a smaller visible map area for debugging purposes.
      paddingX = (west - east) * 0.4;
      paddingY = (south - north) * 0.4;
    }

    return {
      south: south - paddingY,
      west: west - paddingX,
      north: north + paddingY,
      east: east + paddingX,
    };
  }, [south, west, north, east]);

  // Fetch image points in new target area whenever the map bounds exceed the currently fetched area
  useEffect(() => {
    (async () => {
      const bboxVisibleMapArea = createBboxForVisibleMapArea();
      if (
        !loadedImagePoints ||
        loadedImagePoints.timePeriod !== timePeriod ||
        !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
      ) {
        const [lat, lng] = mapCenter;
        const targetBbox = createSquareBboxAroundPoint(
          { lat, lng },
          settings.targetBboxSize
        );
        const {
          imagePoints,
          expandedBbox,
          fetchedBboxes,
        } = await getImagePointsInTilesOverlappingBbox(targetBbox, timePeriod);
        setLoadedImagePoints({ imagePoints, bbox: expandedBbox, timePeriod });
        setFetchedBboxes(fetchedBboxes);
        setTargetBbox(targetBbox);
      }
    })();
  }, [
    mapCenter,
    loadedImagePoints,
    timePeriod,
    createBboxForVisibleMapArea,
    setLoadedImagePoints,
  ]);

  const imagePointIsWithinBbox = (imagePoint, bbox) => {
    const latlng = getImagePointLatLng(imagePoint);
    return isWithinBbox(latlng, bbox);
  };

  const getMarkerIcon = (vegkategori, isDirectional, isSelected) => {
    const iconUrl = `images/marker-${
      vegkategori === "E" || vegkategori === "R" ? "ER" : "FK"
    }-${timePeriod === timePeriods[0] ? "newest" : "older"}-${
      isDirectional ? "directional" : "nondirectional"
    }${isSelected ? "-selected" : ""}.svg`;
    let iconSize, iconAnchor;
    if (currentCoordinates.zoom >= 16) {
      iconSize = isDirectional ? [15, 25] : [10, 10];
      iconAnchor = isDirectional ? [7, 12] : [5, 5];
    } else {
      iconSize = isDirectional ? [12, 20] : [8, 8];
      iconAnchor = isDirectional ? [6, 10] : [4, 4];
    }
    return new Icon({
      iconUrl: iconUrl,
      iconSize: iconSize,
      iconAnchor: iconAnchor,
    });
  };

  const renderImagePoints = () => {
    if (loadedImagePoints?.imagePoints) {
      const mapBbox = createBboxForVisibleMapArea();
      const imagePointsToRender = loadedImagePoints.imagePoints.filter(
        (imagePoint) => imagePointIsWithinBbox(imagePoint, mapBbox)
      );
      return (
        <>
          {imagePointsToRender.map((imagePoint) => {
            const latlng = getImagePointLatLng(imagePoint);
            const isDirectional = imagePoint.properties.RETNING !== undefined;
            const isSelected =
              currentImagePoint && currentImagePoint.id === imagePoint.id;
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
                onmouseover={(event) => event.target.openPopup()}
                onmouseout={(event) => event.target.closePopup()}
                onclick={() => {
                  setCurrentImagePoint(imagePoint);
                  setCurrentCoordinates({ latlng: latlng, zoom: zoom });
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
    return renderBbox(targetBbox, "red");
  };

  const renderFetchBboxes = () => {
    if (fetchedBboxes) {
      return <>{fetchedBboxes.map((bbox) => renderBbox(bbox, "blue"))}</>;
    }
  };

  const renderLoadedBbox = () => {
    // This bbox should correspond to the union of the fetchBboxes, so it will generelly not be visible
    if (loadedImagePoints) {
      return renderBbox(loadedImagePoints.bbox, "orange");
    }
  };

  const renderMapAreaBbox = () => {
    const bbox = createBboxForVisibleMapArea();
    return renderBbox(bbox, "green");
  };

  const renderBboxes = () => {
    if (settings.debugMode) {
      return (
        <>
          {renderTargetBbox()}
          {renderMapAreaBbox()}
          {renderFetchBboxes()}
          {renderLoadedBbox()}
        </>
      );
    }
  };

  return (
    <>
      {renderBboxes()}
      {renderImagePoints()}
    </>
  );
};

export default ImagePointsLayerSmallMap;
