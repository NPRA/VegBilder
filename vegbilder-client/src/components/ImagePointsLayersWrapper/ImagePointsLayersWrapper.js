import React from 'react';
import { useLeafletZoom } from 'use-leaflet';
import { WMSTileLayer } from 'react-leaflet';

import { useYearFilter } from 'contexts/YearFilterContext';
import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  const { year } = useYearFilter();

  const renderImagePointsLayer = () => {
    if (zoom > 14) {
      return <ImagePointsLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else if (zoom > 9) {
      return (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={`Vegbilder_${year}`}
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      );
    } else {
      return (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={`Vegbilder_oversikt_${year}`}
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      );
    }
  };
  return renderImagePointsLayer();
};

export default ImagePointLayersWrapper;
