import React, { useEffect, useState, useCallback } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds, useLeafletCenter } from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";
import leafletrotatedmarker from "leaflet-rotatedmarker"; // Your IDE may report this as unused, but it is required for the rotationAngle property of Marker to work
import _ from "lodash";

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
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import {
  getImagePointLatLng,
  findNearestImagePoint,
} from "../../utilities/imagePointUtilities";
import { splitDateTimeString } from "../../utilities/dateTimeUtilities";

const settings = {
  targetBboxSize: 2000, // Will be used as the size of the bbox for fetching image points if the map bounds are not used (decided by shouldUseMapBoundsAsTargetBbox prop)
  debugMode: false,
};

const ImagePointsLayer = ({ shouldUseMapBoundsAsTargetBbox }) => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const mapCenter = useLeafletCenter();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const [targetBbox, setTargetBbox] = useState(null);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { currentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const { timePeriod } = useTimePeriod();
  const { command, resetCommand } = useCommand();

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
    if (!loadedImagePoints || !currentCoordinates) return false;
    const nearestImagePoint = findNearestImagePoint(
      loadedImagePoints.imagePoints,
      currentCoordinates.latlng
    );
    setCurrentImagePoint(nearestImagePoint);
    return true;
  }, [loadedImagePoints, currentCoordinates, setCurrentImagePoint]);

  function keepOnlyNewestWhereMultipleImageSeries(imagePoints) {
    function roadContextString(imagePoint) {
      let roadContext = `${imagePoint.properties.VEGKATEGORI}${imagePoint.properties.VEGSTATUS}${imagePoint.properties.VEGNUMMER} S${imagePoint.properties.STREKNING}D${imagePoint.properties.DELSTREKNING}`;
      if (imagePoint.properties.KRYSSDEL) {
        roadContext += ` KD${imagePoint.properties.KRYSSDEL}`;
      }
      if (imagePoint.properties.SIDEANLEGGSDEL) {
        roadContext += ` SD${imagePoint.properties.SIDEANLEGGSDEL}`;
      }
      roadContext += `F${imagePoint.properties.FELTKODE}`;
      return roadContext;
    }
    function getDate(imagePoint) {
      return splitDateTimeString(imagePoint.properties.TIDSPUNKT)?.date;
    }
    let newestImagePoints = [];
    const groupedByRoadContext = _.groupBy(imagePoints, roadContextString);
    for (const [roadContext, imagePointsForRoadContext] of Object.entries(
      groupedByRoadContext
    )) {
      const groupedByDate = _.groupBy(imagePointsForRoadContext, getDate);
      let latestDate = "0001-01-01";
      for (const [date] of Object.entries(groupedByDate)) {
        if (date > latestDate) latestDate = date;
      }
      groupedByRoadContext[roadContext] = groupedByDate;
      newestImagePoints = [...newestImagePoints, ...groupedByDate[latestDate]];
    }
    console.log("Grouped by road context and then date:");
    console.log(groupedByRoadContext);

    return newestImagePoints;
  }

  /* Fetch image points in new target area whenever the map bounds exceed the currently fetched area
   * or user has selected a new time period.
   */
  useEffect(() => {
    (async () => {
      const bboxVisibleMapArea = createBboxForVisibleMapArea();
      if (
        !loadedImagePoints ||
        loadedImagePoints.timePeriod !== timePeriod ||
        !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
      ) {
        const [lat, lng] = mapCenter;
        let targetBbox;
        if (shouldUseMapBoundsAsTargetBbox) {
          targetBbox = bboxVisibleMapArea;
        } else {
          targetBbox = createSquareBboxAroundPoint(
            { lat, lng },
            settings.targetBboxSize
          );
        }
        const {
          imagePoints,
          expandedBbox,
          fetchedBboxes,
        } = await getImagePointsInTilesOverlappingBbox(targetBbox, timePeriod);
        const filteredImagePoints = keepOnlyNewestWhereMultipleImageSeries(
          imagePoints
        );
        setLoadedImagePoints({
          imagePoints: filteredImagePoints,
          bbox: expandedBbox,
          timePeriod,
        });
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

  // Apply command if present
  useEffect(() => {
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
        if (wasSuccessful) {
          resetCommand();
        }
        break;
      default:
      // Any other commands do not apply to this component and will be ignored
    }
  }, [command, resetCommand, selectNearestImagePointToCurrentCoordinates]);

  const imagePointIsWithinBbox = (imagePoint, bbox) => {
    const latlng = getImagePointLatLng(imagePoint);
    return isWithinBbox(latlng, bbox);
  };

  const getMarkerIcon = (vegkategori, isDirectional, isSelected) => {
    const iconUrl = `images/markers/marker-${
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
            const isDirectional = imagePoint.properties.RETNING != null;
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
                onclick={() => {
                  setCurrentImagePoint(imagePoint);
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
