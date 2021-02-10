import React, { useCallback, useEffect, useState } from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useLeafletBounds } from 'use-leaflet';

import { crsUtm33N } from './crs';
import ImagePointLayersWrapper from 'components/ImagePointsLayersWrapper/ImagePointsLayersWrapper';
import MapControls from 'components/MapControls/MapControls';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { currentYearState } from 'recoil/atoms';
import getImagePointsInTilesOverlappingBbox from 'apis/VegbilderOGC/getImagePointsInTilesOverlappingBbox';
import { IImagePoint, ILatlng } from 'types';
import { findNearestImagePoint } from 'utilities/imagePointUtilities';
import { createSquareBboxAroundPoint, isBboxWithinContainingBbox } from 'utilities/latlngUtilities';
import { availableYearsQuery } from 'recoil/selectors';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { settings } from 'constants/constants';
import useQueryParamState from 'hooks/useQueryParamState';

interface IMapContainerProps {
  showMessage: (message: string) => void;
}

const MapContainer = ({ showMessage }: IMapContainerProps) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const [[south, west], [north, east]] = useLeafletBounds();
  const [isFetching, setIsFetching] = useState(false);
  const { loadedImagePoints, setLoadedImagePoints } = useLoadedImagePoints();
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const { setCurrentImagePoint } = useCurrentImagePoint();
  const [, setQueryParamYear] = useQueryParamState('year');

  const createBboxForVisibleMapArea = useCallback(() => {
    // Add some padding to the bbox because the meridians do not perfectly align with the vertical edge of the screen (projection issues)
    let paddingX = (east - west) * 0.1;
    let paddingY = (north - south) * 0.1;
    if (settings.debugMode) {
      // Simulate a smaller visible map area for debugging purposes.
      paddingX = (west - east) * 0.2;
      paddingY = (south - north) * 0.2;
    }

    return {
      south: south - paddingY,
      west: west - paddingX,
      north: north + paddingY,
      east: east + paddingX,
    };
  }, [south, west, north, east]);

  const fetchImagePointsFromNewestYearWhereUserClicked = (latlng: ILatlng) => {
    const bboxVisibleMapArea = createBboxForVisibleMapArea();
    if (isFetching) return;
    if (
      !loadedImagePoints ||
      currentYear === 'Nyeste' ||
      !isBboxWithinContainingBbox(bboxVisibleMapArea, loadedImagePoints.bbox)
    ) {
      availableYears.some(async (year) => {
        setIsFetching(true);
        const targetBbox = createSquareBboxAroundPoint(latlng, settings.targetBboxSize);
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
          selectNearestImagePointToClickedCoordinates(imagePoints, latlng);
          setIsFetching(false);
          return imagePoints.length > 0;
        }
      });
    }
  };

  const selectNearestImagePointToClickedCoordinates = useCallback(
    (imagePoints: IImagePoint[], latlng) => {
      if (!imagePoints || !imagePoints.length || !currentCoordinates) return;
      const nearestImagePoint = findNearestImagePoint(imagePoints, latlng);
      if (nearestImagePoint) {
        const year = nearestImagePoint.properties.AAR;
        setCurrentImagePoint(nearestImagePoint);
        setCurrentYear(year);
        setQueryParamYear(year.toString());
        showMessage(
          `Setter årstallet til ${year}, som er det året med de nyeste bildene i området.`
        );
      } else {
        showMessage(
          'Fant ikke noen bilder i nærheten av der du klikket. Prøv å klikke et annet sted.'
        );
      }
      return nearestImagePoint;
    },
    [
      loadedImagePoints,
      currentCoordinates,
      setCurrentImagePoint,
      setCurrentYear,
      setQueryParamYear,
      showMessage,
    ]
  );

  /* Fetch image points in new target area when the user clicks on the map. If we find an image, we set the year to the year where we found the image.
   */
  const handleClick = (event: any) => {
    const userClickedLatLng = event.latlng;
    setCurrentCoordinates({ latlng: userClickedLatLng, zoom: 15 });
    fetchImagePointsFromNewestYearWhereUserClicked(userClickedLatLng);
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
