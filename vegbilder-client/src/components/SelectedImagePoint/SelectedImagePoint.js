import React, { useState, useEffect } from "react";
import { Icon } from "leaflet";
import { Rectangle, Marker } from "react-leaflet";
import { useLeafletMap } from "use-leaflet";

import getFeature from "../../apis/VegbilderOGC/getFeature";
import getDistanceInMetersBetween from "../../utilities/latlngUtilities";

const SelectedImagePoint = ({ currentImagePoint, setCurrentImagePoint }) => {
  const map = useLeafletMap();
  const [clickBbox, setClickBbox] = useState(null);

  useEffect(() => {
    map.on("click", async (event) => {
      console.log(`Clicked on location ${event.latlng}`);
      const { lat, lng } = event.latlng;
      const bbox = {
        west: lng - 0.0002,
        south: lat - 0.0001,
        east: lng + 0.0002,
        north: lat + 0.0001,
      };
      setClickBbox(bbox);
      const featureResponse = await getFeature(bbox);
      console.log(
        `Found ${featureResponse.data.totalFeatures} image points near the click point. Selecting the closest one:`
      );
      const imagePoints = featureResponse.data.features;
      const nearestImagePoint = findNearestImagePoint(imagePoints, lat, lng);
      setCurrentImagePoint(nearestImagePoint);
      console.log(nearestImagePoint);
    });
    return () => {
      map.off("click");
    };
  }, [map, setCurrentImagePoint]);

  const findNearestImagePoint = (imagePoints, lat, lng) => {
    let nearestPoint = { distance: 100000000, imagePoint: null };
    imagePoints.forEach((ip) => {
      const imageLat = ip.geometry.coordinates[1];
      const imageLng = ip.geometry.coordinates[0];
      const distance = getDistanceInMetersBetween(
        { lat: lat, lng: lng },
        { lat: imageLat, lng: imageLng }
      );
      if (distance < nearestPoint.distance) {
        nearestPoint = { distance: distance, imagePoint: ip };
      }
    });
    return nearestPoint.imagePoint;
  };

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

  const getMarkerIcon = () => {
    return new Icon({
      iconUrl: "images/marker-current.png",
      iconSize: [15, 15],
      iconAnchor: [7, 7],
    });
  };

  const renderCurrentImagePoint = () => {
    if (currentImagePoint) {
      const lat = currentImagePoint.geometry.coordinates[1];
      const lng = currentImagePoint.geometry.coordinates[0];
      return (
        <Marker
          key={currentImagePoint.id}
          position={[lat, lng]}
          icon={getMarkerIcon()}
        />
      );
    } else {
      return null;
    }
  };

  return (
    <>
      {renderBbox()}
      {renderCurrentImagePoint()}
    </>
  );
};

export default SelectedImagePoint;
