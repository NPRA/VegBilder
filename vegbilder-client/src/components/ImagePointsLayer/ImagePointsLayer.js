import React, { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds } from "use-leaflet";
import { Rectangle, Marker, Popup } from "react-leaflet";
import leafletrotatedmarker from "leaflet-rotatedmarker"; // Your linter may report this as unused, but it is required for the rotationAngle property of Marker to work
import { useHistory } from "react-router-dom";

import getImagePointsInTilesOverlappingBbox from "../../apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox";
import { isWithinBbox } from "../../utilities/latlngUtilities";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { timePeriods, useTimePeriod } from "../../contexts/TimePeriodContext";
import {
  getImagePointLatLng,
  getImageUrl,
} from "../../utilities/imagePointUtilities";

const settings = {
  useSmallerMapAreaBbox: false,
  drawBboxes: false,
};

const ImagePointsLayer = () => {
  const history = useHistory();
  const [[south, west], [north, east]] = useLeafletBounds();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const { timePeriod } = useTimePeriod();

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
            const isDirectional = imagePoint.properties.RETNING !== undefined;
            const isSelected =
              currentImagePoint && currentImagePoint.id === imagePoint.id;
            const icon = getMarkerIcon(isDirectional, isSelected);
            return (
              <Marker
                key={imagePoint.id}
                position={latlng}
                icon={icon}
                rotationAngle={imagePoint.properties.RETNING}
                onclick={() => {
                  setCurrentImagePoint(imagePoint);
                  setCurrentCoordinates({ latlng: latlng, zoom: 16 });
                  history.push("/bilde");
                }}
              />
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
