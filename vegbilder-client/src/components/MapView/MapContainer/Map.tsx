import React, { useState } from 'react';
import { TileLayer, MapContainer, useMapEvents, useMap } from 'react-leaflet';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LeafletEvent, LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from 'constants/crs';
import ImagePointMapLayers from './ImagePointMapLayers/ImagePointMapLayers';
import MapControls from './MapControls/MapControls';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { latLngZoomQueryParameterState } from 'recoil/selectors';
import './MapContainer.css';
import { ILatlng } from 'types';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

interface IMapContainerEventHandlerProps {
  showMessage: (message: string) => void;
  setCursor: (cursor: string) => void;
}

const ChangeView = ({ center, zoom }: { center: ILatlng; zoom: number | undefined }) => {
  const map = useMap();
  if (center && zoom) {
    map.setView(center, zoom);
  }
  return null;
};

const MapContainerEventHandler = ({ showMessage, setCursor }: IMapContainerEventHandlerProps) => {
  const [mouseMoved, setMouseMoved] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);

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
    zoom(event: LeafletEvent) {
      const latlng = event.target._animateToCenter;
      if (latlng && event.target._animateToZoom)
        setCurrentCoordinates({ ...latlng, zoom: event.target._animateToZoom });
    },
    dragend(event: LeafletEvent) {
      const latlng = event.target._animateToCenter;
      if (latlng) {
        setCurrentCoordinates({ ...latlng });
      }
    },
  });
  return null;
};

const Map = ({ showMessage }: IMapContainerProps) => {
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [cursor, setCursor] = useState('pointer');

  /* We use "prikkekartet" when no image point is selected or when we are in nyeste mode. Then, the user can click on the map to select an image. */

  const clickableMap =
    currentYear === 'Nyeste' ||
    !currentImagePoint ||
    (currentCoordinates.zoom && currentCoordinates.zoom < 15);

  return (
    <MapContainer
      style={clickableMap ? { cursor: cursor } : {}}
      crs={crsUtm33N}
      minZoom={4}
      maxZoom={16}
      zoomControl={false}
    >
      <MapContainerEventHandler showMessage={showMessage} setCursor={setCursor} />
      <ChangeView center={currentCoordinates} zoom={currentCoordinates.zoom} />
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
