import React from "react";
import { useLeafletZoom } from "use-leaflet";

import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";

const MapLayersWrapper = () => {
  const zoom = useLeafletZoom();

  return <>{zoom > 13 && <ImagePointsLayer />}</>;
};

export default MapLayersWrapper;
