import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { LeafletMouseEvent } from 'leaflet';

import { crsUtm33N } from './crs';
import ImagePointLayersWrapper from 'components/ImagePointsLayersWrapper/ImagePointsLayersWrapper';
import MapControls from './MapControls/MapControls';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { currentYearState } from 'recoil/atoms';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import useNearestImagePoint from 'hooks/useNearestImagepoint';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { settings } from 'constants/constants';
import useQueryParamState from 'hooks/useQueryParamState';
import { availableYearsQuery } from 'recoil/selectors';
import { ILatlng, IImagePoint } from 'types';
import { findNearestImagePoint } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint } from 'utilities/latlngUtilities';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

const MapContainer = ({ showMessage }: IMapContainerProps) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const { setCurrentImagePoint } = useCurrentImagePoint();
  const [cursor, setCursor] = useState('pointer');
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const [, setQueryParamYear] = useQueryParamState('year');

  const [mouseMoved, setMouseMoved] = useState(false);
  const [scrolling, setScrolling] = useState(false);

  /* Fetch image points in new target area when the user clicks on the map. If we find an image, we set the year to the year where we found the image.
   */
  const handleClick = (event: LeafletMouseEvent) => {
    const userClickedLatLng = event.latlng;
    let zoom = currentCoordinates.zoom;
    if (!currentCoordinates.zoom || currentCoordinates.zoom < 14) {
      zoom = 15;
    }
    setCurrentCoordinates({ latlng: userClickedLatLng, zoom: zoom });
    fetchImagePointsFromNewestYearByLatLng(userClickedLatLng);
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

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    if (isFetching) return;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      const targetBbox = createSquareBboxAroundPoint(latlng, settings.nyesteTargetBboxSize);
      let foundImage = false;
      for (const year of availableYears) {
        const { imagePoints, expandedBbox } = await getImagePointsInTilesOverlappingBbox(
          targetBbox,
          year
        );
        if (imagePoints && imagePoints.length > 0) {
          setLoadedImagePoints({
            imagePoints: imagePoints,
            bbox: expandedBbox,
            year: year,
          });
          const nearestImagePoint = selectNearestImagePointToCoordinates(imagePoints, latlng);
          setIsFetching(false);
          if (nearestImagePoint) {
            const year = nearestImagePoint.properties.AAR;
            setCurrentImagePoint(nearestImagePoint);
            setCurrentYear(year);
            setQueryParamYear(year.toString());
            showMessage(
              `Setter årstallet til ${year}, som er det året med de nyeste bildene i området.`
            );
            foundImage = true;
            break;
          }
        }
      }
      if (!foundImage) {
        showMessage(
          'Finner ingen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
        );
      }
    }
  }

  const selectNearestImagePointToCoordinates = useCallback(
    (imagePoints: IImagePoint[], latlng) => {
      if (!imagePoints || !imagePoints.length || !currentCoordinates) return;
      const nearestImagePoint = findNearestImagePoint(imagePoints, latlng, 300);
      if (nearestImagePoint) {
        return nearestImagePoint;
      }
    },
    [currentCoordinates]
  );

  return (
    <Map
      center={currentCoordinates.latlng}
      style={currentYear === 'Nyeste' ? { cursor: cursor } : {}}
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
