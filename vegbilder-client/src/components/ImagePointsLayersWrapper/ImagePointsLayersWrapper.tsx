import React from 'react';
import { useLeafletZoom } from 'use-leaflet';
import { WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import { currentYearState } from 'recoil/atoms';

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  const year = useRecoilValue(currentYearState);

  const getLayers = () => {
    if (zoom > 9) return year === 'Nyeste' ? `Vegbilder_${2020}` : `Vegbilder_${year}`; // det skal komme et annet kartlag her for nyeste (nå brukes 2020 som placeholder)
    return year === 'Nyeste' ? `Vegbilder_oversikt_${2020}` : `Vegbilder_oversikt_${year}`;
  };

  const renderImagePointsLayer = () => {
    if (zoom > 14 && year !== 'Nyeste') {
      return <ImagePointsLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={getLayers()}
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
