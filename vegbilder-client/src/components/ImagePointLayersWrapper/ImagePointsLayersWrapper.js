import React from "react";
import { useLeafletZoom } from "use-leaflet";
import { WMSTileLayer } from "react-leaflet";

import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";
import SelectedImagePoint from "../SelectedImagePoint/SelectedImagePoint";

const ImagePointLayersWrapper = ({
  currentLocation,
  currentImagePoint,
  setCurrentImagePoint,
}) => {
  const zoom = useLeafletZoom();

  return (
    <>
      <WMSTileLayer
        url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
        attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
        layers="Vegbilder_2020"
        format="image/png"
        transparent={true}
      />
      {zoom > 13 && <ImagePointsLayer />}
      <SelectedImagePoint
        currentImagePoint={currentImagePoint}
        setCurrentImagePoint={setCurrentImagePoint}
        currentLocation={currentLocation}
      />
    </>
  );
};

export default ImagePointLayersWrapper;
