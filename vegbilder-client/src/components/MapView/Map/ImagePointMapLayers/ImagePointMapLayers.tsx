import React from 'react';
import { useMap, WMSTileLayer } from 'react-leaflet';
import { useRecoilValue } from 'recoil';

import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';
import { OGC_URL } from 'constants/urls';

const ImagePointMapLayers = () => {
  const zoom = useMap().getZoom();
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);

  const showImagePointsMarkers = zoom > 14 && currentYear !== 'Nyeste' && currentImagePoint;
  const showNyesteKartlag = currentYear === 'Nyeste';

  const imageTypeHasImagesForYear = (imageType: string, year: number) => {
    return availableYearsForAllImageTypes[imageType].includes(year);
  };

  const getMapLayer = () => {

    //There will be instances where not all imageTypes have images in the selected year.
    //To avoid errors from the api, we therefore select the imageType we know has images.
      if (showNyesteKartlag) { 
        return `vegbilder_1_0:Vegbilder_dekning, vegbilder_1_0:Vegbilder_360_dekning`; 
      } else if (typeof currentYear === 'number') {
        if (imageTypeHasImagesForYear('panorama', currentYear) && imageTypeHasImagesForYear('planar', currentYear)) {
          return `vegbilder_1_0:Vegbilder_oversikt_${currentYear}, vegbilder_1_0:Vegbilder_360_oversikt_${currentYear}`;
        } else if (!imageTypeHasImagesForYear('panorama', currentYear) && imageTypeHasImagesForYear('planar', currentYear)) {
          return `vegbilder_1_0:Vegbilder_oversikt_${currentYear}`;
        } else if (imageTypeHasImagesForYear('panorama', currentYear) && !imageTypeHasImagesForYear('planar', currentYear)) {
          return `vegbilder_1_0:Vegbilder_360_oversikt_${currentYear}`;
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
        </>
      );
    }
  };
  return renderImagePointsLayer();
};

export default ImagePointMapLayers;
