import React, { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds } from "use-leaflet";
import { Rectangle, Marker, Popup } from "react-leaflet";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import leafletrotatedmarker from "leaflet-rotatedmarker";
import { useHistory } from "react-router-dom";

import getImagePointsInTilesOverlappingBbox from "../../apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox";
import { isWithinBbox } from "../../utilities/latlngUtilities";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";

const settings = {
  useSmallerMapAreaBbox: false,
  drawBboxes: false,
};

const ImagePointsLayer = () => {
  const history = useHistory();
  const [[south, west], [north, east]] = useLeafletBounds();
  const [fetchedBboxes, setFetchedBboxes] = useState([]);
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();

  // Fetch image points in the target area whenever the map bounds change
  useEffect(() => {
    (async () => {
      const targetBbox = createTargetBbox();
      const {
        imagePoints,
        fetchedBboxes,
      } = await getImagePointsInTilesOverlappingBbox(targetBbox);
      setLoadedImagePoints({ imagePoints, bbox: targetBbox });
      setFetchedBboxes(fetchedBboxes);
    })();
  }, [south, west, north, east]);

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
    const lat = imagePoint.geometry.coordinates[1];
    const lng = imagePoint.geometry.coordinates[0];
    return isWithinBbox({ lat, lng }, bbox);
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
                  history.push("/bilde");
                }}
              >
                <Popup>
                  <img src={imagePoint.properties.URL} width={"300px"}></img>
                </Popup>
              </Marker>
            );
          })}
        </>
      );
    }
  };

  return (
    <>
      {settings.drawBboxes && renderTargetBbox()}
      {settings.drawBboxes && renderFetchBboxes()}
      {renderImagePoints()}
    </>
  );
};

export default ImagePointsLayer;
