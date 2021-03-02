import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecoilValue } from 'recoil';
import { LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from './crs';
import ImagePointLayersWrapper from 'components/ImagePointsLayersWrapper/ImagePointsLayersWrapper';
import MapControls from './MapControls/MapControls';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { currentYearState } from 'recoil/atoms';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import useNearestImagePoint from 'hooks/useNearestImagepoint';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

const MapContainer = ({ showMessage }: IMapContainerProps) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const currentYear = useRecoilValue(currentYearState);
  const { setCurrentImagePoint } = useCurrentImagePoint();
  const nearestImagePoint = useNearestImagePoint(
    showMessage,
    'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
  );

  /* Fetch image points in new target area when the user clicks on the map. If we find an image, we set the year to the year where we found the image.
   */
  const handleClick = (event: LeafletMouseEvent) => {
    const userClickedLatLng = event.latlng;
    let zoom = currentCoordinates.zoom;
    if (!currentCoordinates.zoom || currentCoordinates.zoom < 14) {
      zoom = 15;
    }
    setCurrentCoordinates({ latlng: userClickedLatLng, zoom: zoom });
    setCurrentImagePoint(nearestImagePoint);
  };

  return (
    <Map
      center={currentCoordinates.latlng}
      zoom={currentCoordinates.zoom}
      crs={crsUtm33N}
      minZoom={4}
      maxZoom={16}
      zoomControl={false}
      onclick={handleClick}
      style={currentYear === 'Nyeste' ? { cursor: 'pointer' } : {}}
      onViewportChanged={({ center, zoom }) => {
        if (center && zoom) {
          // Center and zoom is not defined immediately after rendering, for some reason, so the above if check is necessary. (Or the app would crash if you start dragging the map immediately after rendering.)
          const latlng = { lat: center[0], lng: center[1] };
          setCurrentCoordinates({ latlng, zoom });
        }
      }}
    >
      <TileLayer
        url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
        attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
        subdomains="123456789"
      />
      <ImagePointLayersWrapper />
      <MapControls />
    </Map>
  );
};

export default MapContainer;
