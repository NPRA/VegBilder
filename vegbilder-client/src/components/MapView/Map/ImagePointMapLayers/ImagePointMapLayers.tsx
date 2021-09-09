import React from 'react';
import { useMap, WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useMap().getZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const oversiktsKartlag = showNyesteKartlag
    ? `Vegbilder_dekning`
    : `Vegbilder_oversikt_${currentYear}`;

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
      return <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <WMSTileLayer
          key={oversiktsKartlag}
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
