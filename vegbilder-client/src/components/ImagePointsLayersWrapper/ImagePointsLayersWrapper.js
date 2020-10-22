import React from "react";
import { WMSTileLayer } from "react-leaflet";

const ImagePointLayersWrapper = () => {
  return (
    <WMSTileLayer
      url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
      attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
      layers="Vegbilder_2020"
      format="image/png"
      transparent={true}
      opacity={0.6}
    />
  );
};

export default ImagePointLayersWrapper;
