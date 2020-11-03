import React, { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds, useLeafletCenter } from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import leafletrotatedmarker from "leaflet-rotatedmarker";

import getImagePointsInTilesOverlappingBbox from "../../apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox";
import {
  createSquareBboxAroundPoint,
  isWithinBbox,
  isBboxWithinContainingBbox,
} from "../../utilities/latlngUtilities";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCallback } from "react";

const settings = {
  targetBboxSize: 400,
  debugMode: true,
};

const ImagePointsLayerSmallMap = () => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const [targetBbox, setTargetBbox] = useState(null);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();

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
        !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
      ) {
        console.log("Must get more data!");
        const [lat, lng] = mapCenter;
        const targetBbox = createSquareBboxAroundPoint(
          { lat, lng },
          settings.targetBboxSize
        );
        const {
          imagePoints,
          expandedBbox,
          fetchedBboxes,
        } = await getImagePointsInTilesOverlappingBbox(targetBbox);
        setLoadedImagePoints({ imagePoints, bbox: expandedBbox });
        setFetchedBboxes(fetchedBboxes);
        setTargetBbox(targetBbox);
      }
    })();
  }, [
    mapCenter,
    loadedImagePoints,
    createBboxForVisibleMapArea,
    setLoadedImagePoints,
  ]);

  const imagePointIsWithinBbox = (imagePoint, bbox) => {
    const lat = imagePoint.geometry.coordinates[1];
    const lng = imagePoint.geometry.coordinates[0];
    return isWithinBbox({ lat, lng }, bbox);
  };

  const getMarkerIcon = (isDirectional, isSelected) => {
    const iconUrl = `images/marker${isDirectional ? "-directional" : ""}${
      isSelected ? "-selected" : ""
    }.png`;
    return new Icon({
      iconUrl: iconUrl,
      iconSize: [15, 15],
      iconAnchor: [7, 7],
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
            const lat = imagePoint.geometry.coordinates[1];
            const lng = imagePoint.geometry.coordinates[0];
            const isDirectional = imagePoint.properties.RETNING !== undefined;
            const isSelected =
              currentImagePoint && currentImagePoint.id === imagePoint.id;
            const icon = getMarkerIcon(isDirectional, isSelected);
            return (
              <Marker
                key={imagePoint.id}
                position={[lat, lng]}
                icon={icon}
                rotationAngle={imagePoint.properties.RETNING}
                onmouseover={(event) => event.target.openPopup()}
                onmouseout={(event) => event.target.closePopup()}
                onclick={() => {
                  setCurrentImagePoint(imagePoint);
                  setCurrentCoordinates({ latlng: { lat, lng }, zoom: 16 });
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
