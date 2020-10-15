import React, { useEffect, useState } from "react";
import { Icon } from "leaflet";
import { useLeafletBounds } from "use-leaflet";
import { Rectangle, Marker } from "react-leaflet";

import getImagePointsInVisibleMapArea from "../../apis/VegbilderOGC/getImagePointsInVisibleMapArea";

const settings = {
  useSmallerMapAreaBbox: false,
  drawBboxes: false,
};

const ImagePointsLayer = ({ currentImagePoint, setCurrentImagePoint }) => {
  const [[south, west], [north, east]] = useLeafletBounds();
  const [imagePoints, setImagePoints] = useState([]);
  const [fetchedBboxes, setFetchedBboxes] = useState([]);

  useEffect(() => {
    (async () => {
      const bbox = createBboxForVisibleMapArea();
      const {
        imagePoints,
        fetchedBboxes,
      } = await getImagePointsInVisibleMapArea(bbox);
      setImagePoints(imagePoints);
      setFetchedBboxes(fetchedBboxes);
    })();
  }, [south, west, north, east]);

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
      const paddingX = (west - east) * 0.1;
      const paddingY = (north - south) * 0.1;
      return {
        south: south - paddingY,
        west: west + paddingX,
        north: north + paddingY,
        east: east - paddingX,
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

  const renderMapAreaBbox = () => {
    const bbox = createBboxForVisibleMapArea(south, west, north, east);
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

    const iconOptions = {
      iconUrl: iconUrl,
      iconSize: [15, 15],
      iconAnchor: [7, 7],
    };
    if (isSelected) {
      console.log(iconOptions);
    }
    return new Icon(iconOptions);
  };

  const renderImagePoints = () => {
    if (imagePoints) {
      return (
        <>
          {imagePoints.map((imagePoint) => {
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
                onclick={() => setCurrentImagePoint(imagePoint)}
                opacity={0.8}
              />
            );
          })}
        </>
      );
    }
  };

  return (
    <>
      {settings.drawBboxes && renderMapAreaBbox()}
      {settings.drawBboxes && renderFetchBboxes()}
      {renderImagePoints()}
    </>
  );
};

export default ImagePointsLayer;
