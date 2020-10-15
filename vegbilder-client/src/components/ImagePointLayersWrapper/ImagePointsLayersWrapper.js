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
      {zoom > 14 ? (
        <ImagePointsLayer
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
      ) : (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers="Vegbilder_2020"
          format="image/png"
          transparent={true}
        />
      )}
    </>
  );
};

export default ImagePointLayersWrapper;
