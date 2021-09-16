import React from 'react';
import { useMap, WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import { cameraFilterState, currentImagePointState, currentYearState } from 'recoil/atoms';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useMap().getZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const cameraFilter = useRecoilValue(cameraFilterState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const getMapLayer = () => {
    if (cameraFilter === '360') return `Vegbilder_360_${currentYear}`;
    if (cameraFilter === 'planar') {
      if (showNyesteKartlag) {
        return 'Vegbilder_dekning';
      } else {
        return `Vegbilder_oversikt_${currentYear}`;
      }
    }
    return '';
  };

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
      return <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <>
          <WMSTileLayer
            key={getMapLayer()}
            url={OGC_URL}
            attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
            layers={getMapLayer()}
            format="image/png"
            transparent={true}
            opacity={0.6}
          />
          )
        </>
      );
    }
  };
  return renderImagePointsLayer();
};

export default ImagePointMapLayers;
