import React, { useCallback, useEffect, useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecoilValue } from 'recoil';
import { LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from './crs';
import ImagePointLayersWrapper from 'components/ImagePointsLayersWrapper/ImagePointsLayersWrapper';
import MapControls from './MapControls/MapControls';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { useLeafletBounds } from 'use-leaflet';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

const MapContainer = ({ showMessage }: IMapContainerProps) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const [cursor, setCursor] = useState('pointer');
  const currentYear = useRecoilValue(currentYearState);
  const { currentImagePoint } = useCurrentImagePoint();

  const [mouseMoved, setMouseMoved] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  const [[south, west], [north, east]] = useLeafletBounds();

  /* We use "prikkekartet" when no image point is selected or when we are in nyeste mode. Then, the user can click on the map to select an image. */
  const clickableMap = currentYear === 'Nyeste' || !currentImagePoint;

  const fetchNearestLatestImagePoint = useFetchNearestLatestImagePoint(
    showMessage,
    'Fant ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
  );

  const fetchNearestImagePointByYearAndLatLng = useFetchNearestImagePoint(showMessage);

  /* Fetch image points in new target area when the user clicks on the map. If the app is in "nyeste mode" we set the year to the newest year where we find an image. Otherwise, we find an image from current year.
   */
  const handleClick = (event: LeafletMouseEvent) => {
    const userClickedLatLng = event.latlng;
    if (currentYear === 'Nyeste') {
      fetchNearestLatestImagePoint(userClickedLatLng);
    } else {
      if (!currentImagePoint) {
        fetchNearestImagePointByYearAndLatLng(userClickedLatLng, currentYear as number);
      }
    }
  };

  const onMouseDown = (event: LeafletMouseEvent) => {
    event.originalEvent.preventDefault();
    setScrolling(true);
    setMouseMoved(false);
  };

  const onMouseUp = (event: LeafletMouseEvent) => {
    setScrolling(false);
    setCursor('pointer');
    if (!mouseMoved) {
      handleClick(event);
    }
  };

  const onMouseMove = (event: LeafletMouseEvent) => {
    event.originalEvent.preventDefault();
    setMouseMoved(true);
    if (scrolling) {
      setCursor('grabbing');
    }
  };

  const createBboxForVisibleMapArea = useCallback(() => {
    console.log([
      [south, west],
      [north, east],
    ]);
    // Add some padding to the bbox because the meridians do not perfectly align with the vertical edge of the screen (projection issues)
    let paddingX = (east - west) * 0.1;
    let paddingY = (north - south) * 0.1;
    return {
      south: south - paddingY,
      west: west - paddingX,
      north: north + paddingY,
      east: east + paddingX,
    };
  }, [south, west, north, east]);

  return (
    <Map
      center={currentCoordinates.latlng}
      style={clickableMap ? { cursor: cursor } : {}}
      zoom={currentCoordinates.zoom}
      crs={crsUtm33N}
      minZoom={4}
      maxZoom={16}
      zoomControl={false}
      onmousedown={onMouseDown}
      onmousemove={onMouseMove}
      onmouseup={onMouseUp}
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
