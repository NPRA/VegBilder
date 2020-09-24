import React, { useState, useEffect } from "react";
import { Icon } from "leaflet";
import { Rectangle, Marker } from "react-leaflet";
import { useLeafletMap } from "use-leaflet";

import getFeature from "../../apis/VegbilderOGC/getFeature";
import {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
} from "../../utilities/latlngUtilities";

const settings = {
  renderClickBbox: true,
};

const SelectedImagePoint = ({ currentImagePoint, setCurrentImagePoint }) => {
  const map = useLeafletMap();
  const [clickBbox, setClickBbox] = useState(null);

  useEffect(() => {
    map.on("click", selectImagePointNearClick);
    return () => {
      map.off("click", selectImagePointNearClick);
    };
  }, [map, setCurrentImagePoint]);

  const selectImagePointNearClick = async (event) => {
    //console.log(`Clicked on location ${event.latlng}`);
    const clickedPoint = event.latlng;
    const { lat, lng } = event.latlng;
    const bbox = createSquareBboxAroundPoint(clickedPoint, 30);
    setClickBbox(bbox);
    const featureResponse = await getFeature(bbox);
    //console.log(`Found ${featureResponse.data.totalFeatures} image points near the click point. Selecting the closest one:`);
    const imagePoints = featureResponse.data.features;
    const nearestImagePoint = findNearestImagePoint(imagePoints, clickedPoint);
    setCurrentImagePoint(nearestImagePoint);
    //console.log(nearestImagePoint);
  };

  const findNearestImagePoint = (imagePoints, clickedPoint) => {
    let nearestPoint = { distance: 100000000, imagePoint: null };
    imagePoints.forEach((ip) => {
      const imageLat = ip.geometry.coordinates[1];
      const imageLng = ip.geometry.coordinates[0];
      const distance = getDistanceInMetersBetween(
        { lat: clickedPoint.lat, lng: clickedPoint.lng },
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
      {settings.renderClickBbox && renderBbox()}
      {renderCurrentImagePoint()}
    </>
  );
};

export default SelectedImagePoint;
