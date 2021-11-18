import React from 'react';
import { useMap, WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import { currentImageTypeState, currentImagePointState, currentYearState } from 'recoil/atoms';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useMap().getZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const currentImageType = useRecoilValue(currentImageTypeState);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const getMapLayer = () => {
    if (showNyesteKartlag) {
      if (currentImageType === '360') return 'Vegbilder_360_dekning';
      if (currentImageType === 'planar') return 'Vegbilder_dekning';
      //if (currentImageType === 'dekkekamera') return '';
      //if (currentImageType === 'all') return 'Vegbilder_dekning'; //TODO: Bytte til et kartlag som viser nyeste for alle.
    } else {
      if (currentImageType === '360') return `Vegbilder_360_oversikt_${currentYear}`;
      if (currentImageType === 'planar') return `Vegbilder_oversikt_${currentYear}`;
      //if (currentImageType === 'dekkekamera') return ''; //TODO: under arbeid
      //if (currentImageType === 'all') return ''; //TODO: under arbeid
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
