import React from "react";
import { useLeafletMap } from "use-leaflet";

import getFeature from "../../apis/VegbilderOGC/getFeature";

const SelectedImagePoint = () => {
  const map = useLeafletMap();
  map.on("click", async (event) => {
    console.log(`Clicked on location ${event.latlng}`);
    const featureInfo = await getFeature(event.latlng);
    console.log(featureInfo);
  });

  return <div>SelectedImagePoint</div>;
};

export default SelectedImagePoint;
