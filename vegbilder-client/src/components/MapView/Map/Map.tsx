import React, { useEffect, useState } from 'react';
import { TileLayer, MapContainer, useMapEvents, useMap } from 'react-leaflet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from 'constants/crs';
import ImagePointMapLayers from './ImagePointMapLayers/ImagePointMapLayers';
import MapControls from './MapControls/MapControls';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { latLngZoomQueryParameterState } from 'recoil/selectors';
import './Map.css';
import { ILatlng } from 'types';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

interface IMapContainerEventHandlerProps {
  showMessage: (message: string) => void;
  setCursor: (cursor: string) => void;
}

//This "component" is only used to get a reference to the map and update the view in certain situations (e.g. click to zoom).
const ChangeMapView = ({ center, zoom }: { center: ILatlng; zoom: number | undefined }) => {
  const map = useMap();
  useEffect(() => {
    if (center && zoom) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapContainerEventHandler = ({ showMessage, setCursor }: IMapContainerEventHandlerProps) => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const map = useMap();

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
      fetchNearestLatestImagePoint(userClickedLatLng).then((foundImage) => {
        if (!foundImage && currentCoordinates.zoom && currentCoordinates.zoom < 8) {
          setCurrentCoordinates({ ...userClickedLatLng, zoom: 8 }); // zoom the user more in if it didnt find images
        }
      });
    } else {
      if (!currentImagePoint || (currentCoordinates.zoom && currentCoordinates.zoom < 15)) {
        fetchNearestImagePointByYearAndLatLng(userClickedLatLng, currentYear as number).then(
          (imagePoint) => {
            if (!imagePoint && currentCoordinates.zoom && currentCoordinates.zoom < 8) {
              setCurrentCoordinates({ ...userClickedLatLng, zoom: 8 }); // zoom the user more in if it didnt find images)
            }
          }
        );
      }
    }
  };

  useMapEvents({
    mousedown(event: LeafletMouseEvent) {
      event.originalEvent.preventDefault();
      setScrolling(true);
      setMouseMoved(false);
    },
    mouseup(event: LeafletMouseEvent) {
      setScrolling(false);
      setCursor('pointer');
      let clickedControlButtons = false;
      if (event.originalEvent.target) {
        clickedControlButtons =
          // @ts-ignore: Unreachable code error
          event.originalEvent.target.id === 'zoom-out' ||
          // @ts-ignore: Unreachable code error
          event.originalEvent.target.id === 'zoom-in' ||
          // @ts-ignore: Unreachable code error
          event.originalEvent.target.id === 'my-location';
      }
      if (!mouseMoved && !clickedControlButtons) {
        handleClick(event);
      }
    },
    mousemove(event: LeafletMouseEvent) {
      event.originalEvent.preventDefault();
      setMouseMoved(true);
      if (scrolling) {
        setCursor('grabbing');
      }
    },
    zoom() {
      const zoom = map.getZoom();
      const center = map.getCenter();
      setCurrentCoordinates({ ...center, zoom });
    },
    dragend() {
      const zoom = map.getZoom();
      const center = map.getCenter();
      setCurrentCoordinates({ ...center, zoom });
    },
  });
  return null;
};

const Map = ({ showMessage }: IMapContainerProps) => {
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const currentCoordinates = useRecoilValue(latLngZoomQueryParameterState);
  const [cursor, setCursor] = useState('pointer');

  /* We use "prikkekartet" when no image point is selected or when we are in nyeste mode. Then, the user can click on the map to select an image. */
  const clickableMap =
    currentYear === 'Nyeste' ||
    !currentImagePoint ||
    (currentCoordinates.zoom && currentCoordinates.zoom < 15);

  return (
    <MapContainer
      center={[currentCoordinates.lat, currentCoordinates.lng]}
      zoom={currentCoordinates.zoom}
      style={clickableMap ? { cursor: cursor } : {}}
      crs={crsUtm33N}
      minZoom={4}
      maxZoom={16}
      zoomControl={false}
    >
      <MapContainerEventHandler showMessage={showMessage} setCursor={setCursor} />
      <ChangeMapView
        center={{ lat: currentCoordinates.lat, lng: currentCoordinates.lng }}
        zoom={currentCoordinates.zoom}
      />
      <TileLayer
        url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
        attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
        subdomains="123456789"
      />
      <ImagePointMapLayers />
      <MapControls showMessage={showMessage} />
    </MapContainer>
  );
};

export default Map;
