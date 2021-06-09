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

  const getMapLayers = () => {
    const currentFilteredLayers: string[] = [];

    if (cameraFilter.includes('panorama'))
      currentFilteredLayers.push(`Vegbilder_360_${currentYear}`);
    if (cameraFilter.includes('planar')) {
      if (showNyesteKartlag) {
        currentFilteredLayers.push('Vegbilder_dekning');
      } else {
        currentFilteredLayers.push(`Vegbilder_oversikt_${currentYear}`);
      }
    }
    return currentFilteredLayers;
  };

  const renderImagePointsLayer = () => {
    if (showImagePointsMarkers) {
      return <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={true} />;
    } else {
      return (
        <>
          {getMapLayers().map((maplayer) => (
            <WMSTileLayer
              key={maplayer}
              url={OGC_URL}
              attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
              layers={maplayer}
              format="image/png"
              transparent={true}
              opacity={0.6}
            />
          ))}
        </>
      );
    }
  };
  return renderImagePointsLayer();
};

export default ImagePointMapLayers;
