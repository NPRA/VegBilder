import React, { useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from './crs';
import ImagePointLayersWrapper from 'components/ImagePointsLayersWrapper/ImagePointsLayersWrapper';
import MapControls from './MapControls/MapControls';
import { currentImagePointState, currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { latLngZoomQueryParameterState } from 'recoil/selectors';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

const MapContainer = ({ showMessage }: IMapContainerProps) => {
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [cursor, setCursor] = useState('pointer');
  const currentYear = useRecoilValue(currentYearState);
  const currentImagePoint = useRecoilValue(currentImagePointState);

  const [mouseMoved, setMouseMoved] = useState(false);
  const [scrolling, setScrolling] = useState(false);
  const [mapLayer, setMapLayer] = useState('vegkart');

  /* We use "prikkekartet" when no image point is selected or when we are in nyeste mode. Then, the user can click on the map to select an image. */
  const clickableMap =
    currentYear === 'Nyeste' ||
    !currentImagePoint ||
    (currentCoordinates.zoom && currentCoordinates.zoom < 15);

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
      if (!currentImagePoint || (currentCoordinates.zoom && currentCoordinates.zoom < 15)) {
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
  };

  const onMouseMove = (event: LeafletMouseEvent) => {
    event.originalEvent.preventDefault();
    setMouseMoved(true);
    if (scrolling) {
      setCursor('grabbing');
    }
  };

  return (
    <Map
      center={currentCoordinates}
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
          setCurrentCoordinates({ ...latlng, zoom: zoom });
        }
      }}
    >
      {mapLayer === 'vegkart' ? (
        <TileLayer
          url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
          attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
          subdomains="123456789"
        />
      ) : null}
      {mapLayer === 'flyfoto' ? (
        <TileLayer
          url="https://gatekeeper2.geonorge.no/BaatGatekeeper/gk/gk.nib_utm33_wmts_v2?layer=Nibcache_UTM33_EUREF89_v2&style=default&tilematrixset=default028mm&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix={z}&TileCol={x}&TileRow={y}&gkt=34D723D3AEDF983FCA46EDFAFEB03C1571401E61B1BC8AEA36689FB24D2171AA66C9287D387617CFD6C6AD4751C0D0DFF5F6FFAE6CDC54A021AF2907FC8E07B4"
          attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
          subdomains="123456789"
        />
      ) : null}
      {mapLayer === 'gratone' ? (
        <TileLayer
          url="https://gatekeeper3.geonorge.no/BaatGatekeeper/gk/gk.cache_wmts?layer=topo4graatone&style=default&tilematrixset=EPSG:25833&Service=WMTS&Request=GetTile&Version=1.0.0&Format=image/jpeg&TileMatrix=EPSG:25833:{z}&TileCol={x}&TileRow={y}&gkt=34D723D3AEDF983FCA46EDFAFEB03C1571401E61B1BC8AEA36689FB24D2171AA66C9287D387617CFD6C6AD4751C0D0DFF5F6FFAE6CDC54A021AF2907FC8E07B4"
          attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
          subdomains="123456789"
        />
      ) : null}
      <ImagePointLayersWrapper />
      <MapControls showMessage={showMessage} setMapLayer={setMapLayer} />
    </Map>
  );
};

export default MapContainer;
