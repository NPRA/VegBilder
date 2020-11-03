import React from "react";
import { useLeafletZoom } from "use-leaflet";
import { WMSTileLayer } from "react-leaflet";

import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  return (
    <React.Fragment>
      {zoom > 14 ? (
        <ImagePointsLayer />
      ) : (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers="Vegbilder_2020"
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      )}
    </React.Fragment>
  );
};

export default ImagePointLayersWrapper;
