import React, { useState, useEffect } from "react";
import { Icon } from "leaflet";
import { Rectangle, Marker } from "react-leaflet";
import { useLeafletMap } from "use-leaflet";
import leafletrotatedmarker from "leaflet-rotatedmarker";

import SelectImagePointOnMapClick from "./effects/SelectImagePointOnMapClick";

const settings = {
  renderClickBbox: false,
};

const SelectedImagePoint = ({ currentImagePoint, setCurrentImagePoint }) => {
  const map = useLeafletMap();
  const [clickBbox, setClickBbox] = useState(null);

  useEffect(() => {
    SelectImagePointOnMapClick(map, setCurrentImagePoint, setClickBbox);
  }, [map, setCurrentImagePoint]);

  const renderBbox = () => {
    if (clickBbox) {
      return (
        <Rectangle
          bounds={[
            [clickBbox.south, clickBbox.west],
            [clickBbox.north, clickBbox.east],
          ]}
        />
      );
    } else {
      return null;
    }
  };

  const getNonDirectionalMarkerIcon = () => {
    return new Icon({
      iconUrl: "images/marker-current.png",
      iconSize: [15, 15],
      iconAnchor: [7, 7],
    });
  };

  const getDirectionalMarkerIcon = () => {
    return new Icon({
      iconUrl: "images/marker-current-directional.png",
      iconSize: [15, 22],
      iconAnchor: [7, 11],
    });
  };

  const renderCurrentImagePoint = () => {
    if (currentImagePoint) {
      const lat = currentImagePoint.geometry.coordinates[1];
      const lng = currentImagePoint.geometry.coordinates[0];
      const icon = currentImagePoint.properties.RETNING
        ? getDirectionalMarkerIcon()
        : getNonDirectionalMarkerIcon();
      return (
        <Marker
          key={currentImagePoint.id}
          position={[lat, lng]}
          icon={icon}
          rotationAngle={currentImagePoint.properties.RETNING}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {settings.renderClickBbox && renderBbox()}
      {renderCurrentImagePoint()}
    </>
  );
};

export default SelectedImagePoint;
