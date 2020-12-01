import React from "react";
import { useLeafletZoom } from "use-leaflet";
import { WMSTileLayer } from "react-leaflet";

import { useYearFilter } from "../../contexts/YearFilterContext";
import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  const { year } = useYearFilter();
  return (
    <React.Fragment>
      {zoom > 14 ? (
        <ImagePointsLayer shouldUseMapBoundsAsTargetBbox={true} />
      ) : (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={`Vegbilder_${year}`}
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      )}
    </React.Fragment>
  );
};

export default ImagePointLayersWrapper;
