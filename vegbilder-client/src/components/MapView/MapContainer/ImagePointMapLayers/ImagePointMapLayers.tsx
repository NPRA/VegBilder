import React from 'react';
import { useLeafletZoom } from 'use-leaflet';
import { WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import { cameraFilterState, currentImagePointState, currentYearState } from 'recoil/atoms';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useLeafletZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const cameraFilter = useRecoilValue(cameraFilterState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const getMapLayer = () => {
    if (showNyesteKartlag) {
      return 'Vegbilder_dekning';
    } else if (cameraFilter.includes('panorama')) {
      return `Vegbilder_360_${currentYear}`;
    } else {
      return `Vegbilder_oversikt_${currentYear}`;
    }
  };

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
      return <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <WMSTileLayer
          url={OGC_URL}
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers={getMapLayer()}
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
