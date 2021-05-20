import React from 'react';
import { useLeafletZoom } from 'use-leaflet';
import { WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useLeafletZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const oversiktsKartlag = showNyesteKartlag
    ? `Vegbilder_dekning`
    : `Vegbilder_oversikt_${currentYear}`;

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
      return <ImagePointsLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <WMSTileLayer
          url={OGC_URL}
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={oversiktsKartlag}
          format="image/png"
          transparent={true}
          opacity={0.6}
        />
      );
    }
  };
  return renderImagePointsLayer();
};

export default ImagePointMapLayers;
