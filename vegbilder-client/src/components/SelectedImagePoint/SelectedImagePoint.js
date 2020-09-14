import React, { useState, useEffect } from "react";
import { Rectangle } from "react-leaflet";
import { useLeafletMap } from "use-leaflet";

import getFeature from "../../apis/VegbilderOGC/getFeature";

const SelectedImagePoint = () => {
  const map = useLeafletMap();
  const [bbox, setBbox] = useState(null);

  useEffect(() => {
    map.on("click", async (event) => {
      console.log(`Clicked on location ${event.latlng}`);
      const { lat, lng } = event.latlng;
      setBbox({
        west: lng - 0.0002,
        south: lat - 0.0001,
        east: lng + 0.0002,
        north: lat + 0.0001,
      });
      const featureInfo = await getFeature(event.latlng);
      console.log(featureInfo);
    });
    return () => {
      map.off("click");
    };
  }, []);

  const renderBbox = () => {
    if (bbox) {
      return (
        <Rectangle
          bounds={[
            [bbox.south, bbox.west],
            [bbox.north, bbox.east],
          ]}
        />
      );
    } else {
      return <div></div>;
    }
  };

  return renderBbox();
};

export default SelectedImagePoint;
