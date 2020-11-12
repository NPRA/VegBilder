import React from "react";
import { useLeafletZoom } from "use-leaflet";
import { WMSTileLayer } from "react-leaflet";

import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";
import { useTimePeriod } from "../../contexts/TimePeriodContext";

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  const { timePeriod } = useTimePeriod();
  return (
    <React.Fragment>
      {zoom > 14 ? (
        <ImagePointsLayer />
      ) : (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={`Vegbilder_${timePeriod}`}
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      )}
    </React.Fragment>
  );
};

export default ImagePointLayersWrapper;
