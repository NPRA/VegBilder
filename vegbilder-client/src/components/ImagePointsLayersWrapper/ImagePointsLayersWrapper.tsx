import React from 'react';
import { useLeafletZoom } from 'use-leaflet';
import { WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import { currentYearState } from 'recoil/atoms';

const ImagePointLayersWrapper = () => {
  const zoom = useLeafletZoom();
  const currentYear = useRecoilValue(currentYearState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste';
  const showNyesteKartlag = currentYear === 'Nyeste';

  const oversiktsKartlag = showNyesteKartlag
    ? `Vegbilder_oversikt_${2020}`
    : `Vegbilder_oversikt_${currentYear}`;

  const prikkeKart = showNyesteKartlag ? `Vegbilder_${2020}` : `Vegbilder_${currentYear}`;

  const getLayers = () => {
    if (zoom > 9) {
      return prikkeKart;
    }
    return oversiktsKartlag;
  };

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
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
