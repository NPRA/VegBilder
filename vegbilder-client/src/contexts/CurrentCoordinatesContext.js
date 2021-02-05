import React, { useState, useContext, createContext } from 'react';
import useQueryParamState from 'hooks/useQueryParamState';

const CurrentCoordinatesContext = createContext();

const useCurrentCoordinates = () => {
  const context = useContext(CurrentCoordinatesContext);
  if (!context) {
    throw new Error('useCurrentCoordinates must be used within a CurrentCoordinatesProvider');
  }
  return context;
};

const CurrentCoordinatesProvider = (props) => {
  const [currentLat, setLat] = useQueryParamState('lat');
  const [currentLng, setLng] = useQueryParamState('lng');
  const [currentZoom, setZoom] = useQueryParamState('zoom');

  const lat = parseFloat(currentLat);
  const lng = parseFloat(currentLng);

  const [currentCoordinates, setCurrentCoordinatesInternal] = useState({
    latlng: { lat, lng },
    zoom: parseInt(currentZoom),
  });

  const setCurrentCoordinates = ({ latlng, zoom }) => {
    console.log(latlng);
    const newCoordinates = {
      latlng: latlng,
      zoom: zoom ? zoom : currentCoordinates.zoom,
    };
    setCurrentCoordinatesInternal(newCoordinates);
    setLat(latlng.lat.toString());
    setLng(latlng.lng.toString());
    if (zoom) {
      setZoom(zoom.toString());
    }
  };

  return (
    <CurrentCoordinatesContext.Provider
      value={{ currentCoordinates, setCurrentCoordinates }}
      {...props}
    />
  );
};

export { CurrentCoordinatesProvider, useCurrentCoordinates };
