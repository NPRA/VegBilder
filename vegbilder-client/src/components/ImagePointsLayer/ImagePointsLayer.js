import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds } from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";
import leafletrotatedmarker from "leaflet-rotatedmarker"; // Your linter may report this as unused, but it is required for the rotationAngle property of Marker to work

import getImagePointsInTilesOverlappingBbox from "../../apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox";
import { isWithinBbox } from "../../utilities/latlngUtilities";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { timePeriods, useTimePeriod } from "../../contexts/TimePeriodContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import {
  getImagePointLatLng,
  findNearestImagePoint,
} from "../../utilities/imagePointUtilities";

const settings = {
  useSmallerMapAreaBbox: false,
  drawBboxes: false,
};

const ImagePointsLayer = () => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { currentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const { timePeriod } = useTimePeriod();
  const { command, resetCommand } = useCommand();

  // Fetch image points in the target area whenever the map bounds change
  useEffect(() => {
    (async () => {
      const targetBbox = createTargetBbox();
      const {
        imagePoints,
        fetchedBboxes,
      } = await getImagePointsInTilesOverlappingBbox(targetBbox, timePeriod);
      setLoadedImagePoints({ imagePoints, bbox: targetBbox });
      setFetchedBboxes(fetchedBboxes);
    })();
  }, [south, west, north, east, timePeriod]);

  const createTargetBbox = () => {
    return createBboxForVisibleMapArea();
  };

  const selectNearestImagePointToCurrentCoordinates = useCallback(() => {
    if (!loadedImagePoints || !currentCoordinates) return false;
    const nearestImagePoint = findNearestImagePoint(
      loadedImagePoints.imagePoints,
      currentCoordinates.latlng
    );
    setCurrentImagePoint(nearestImagePoint);
    return true;
  }, [loadedImagePoints, currentCoordinates, setCurrentImagePoint]);

  // Apply command if present
  useEffect(() => {
    if (command) {
      let resetCommandAfterExecution = true;
      switch (command) {
        case commandTypes.selectNearestImagePoint:
          /* Attempt to select the image point nearest to the current coordinates. This is done
           * after a search for vegsystemreferanse in the Search component, but there may
           * also be other uses for it. It is possible that there are no loaded image points,
           * so that no nearest image point can be found. In that case, the command should
           * not be reset, as we want to rerun it on the next render, which may be triggered
           * by loadedImagePoints being populated.
           */
          const wasSuccessful = selectNearestImagePointToCurrentCoordinates();
          resetCommandAfterExecution = wasSuccessful;
          break;
        default:
        // Any other commands do not apply to this component and will be ignored
      }
      if (resetCommandAfterExecution) {
        resetCommand();
      }
    }
  }, [command, resetCommand, selectNearestImagePointToCurrentCoordinates]);

  const createBboxForVisibleMapArea = () => {
    if (settings.useSmallerMapAreaBbox) {
      const dY = north - south;
      const dX = east - west;
      return {
        south: south + dY / 4,
        west: west + dX / 4,
        north: north - dY / 4,
        east: east - dX / 4,
      };
    } else {
      // Add some padding to the bbox because the meridians do not perfectly align with the vertical edge of the screen (projection issues)
      const paddingX = (east - west) * 0.1;
      const paddingY = (north - south) * 0.1;
      return {
        south: south - paddingY,
        west: west - paddingX,
        north: north + paddingY,
        east: east + paddingX,
      };
    }
  };

  const renderBbox = (bbox) => {
    return (
      <Rectangle
        key={`${bbox.south}${bbox.west}${bbox.north}${bbox.east}`}
        bounds={[
          [bbox.south, bbox.west],
          [bbox.north, bbox.east],
        ]}
      />
    );
  };

  const renderTargetBbox = () => {
    const bbox = createTargetBbox();
    return renderBbox(bbox);
  };

  const renderFetchBboxes = () => {
    if (fetchedBboxes) {
      return <>{fetchedBboxes.map((bbox) => renderBbox(bbox))}</>;
    }
  };

  const renderBboxes = () => {
    if (settings.drawBboxes) {
      return (
        <>
          {renderTargetBbox()}
          {renderFetchBboxes()}
        </>
      );
    }
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

  const imagePointIsWithinBbox = (imagePoint, bbox) => {
    const latlng = getImagePointLatLng(imagePoint);
    return isWithinBbox(latlng, bbox);
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
            const isDirectional = imagePoint.properties.RETNING != null;
            const isSelected =
              currentImagePoint && currentImagePoint.id === imagePoint.id;
            const icon = getMarkerIcon(
              imagePoint.properties.VEGKATEGORI,
              isDirectional,
              isSelected
            );
            return (
              <>
                <Marker
                  key={imagePoint.id}
                  position={latlng}
                  icon={icon}
                  rotationAngle={imagePoint.properties.RETNING}
                  onclick={() => {
                    setCurrentImagePoint(imagePoint);
                  }}
                />
              </>
            );
          })}
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

export default ImagePointsLayer;
