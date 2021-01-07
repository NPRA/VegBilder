import React, { useState } from 'react';
import useQueryParamState from 'hooks/useQueryParamState';

const CurrentCoordinatesContext = React.createContext();

function useCurrentCoordinates() {
  const context = React.useContext(CurrentCoordinatesContext);
  if (!context) {
    throw new Error('useCurrentCoordinates must be used within a CurrentCoordinatesProvider');
  }
  return context;
}

function CurrentCoordinatesProvider(props) {
  const [currentCoordinateString, setCurrentCoordinateString] = useQueryParamState(
    'coordinates',
    '65,15,4'
  );
  const [currentCoordinates, setCurrentCoordinatesInternal] = useState(
    parseCoordinateString(currentCoordinateString)
  );

  const setCurrentCoordinates = ({ latlng, zoom }) => {
    const newCoordinates = {
      latlng: latlng,
      zoom: zoom ?? currentCoordinates.zoom,
    };
    const newCoordinateString = `${newCoordinates.latlng.lat},${newCoordinates.latlng.lng},${newCoordinates.zoom}`;
    setCurrentCoordinatesInternal(newCoordinates);
    setCurrentCoordinateString(newCoordinateString);
  };

  return (
    <CurrentCoordinatesContext.Provider
      value={{ currentCoordinates, setCurrentCoordinates }}
      {...props}
    />
  );
}

function parseCoordinateString(coordinateString) {
  const split = coordinateString.split(',');
  const lat = parseFloat(split[0], 10);
  const lng = parseFloat(split[1], 10);
  const zoom = parseInt(split[2], 10);
  return { latlng: { lat, lng }, zoom };
}

export { CurrentCoordinatesProvider, useCurrentCoordinates };
