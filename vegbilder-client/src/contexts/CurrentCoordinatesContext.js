import React, { useState } from "react";

const CurrentCoordinatesContext = React.createContext();

function useCurrentCoordinates() {
  const context = React.useContext(CurrentCoordinatesContext);
  if (!context) {
    throw new Error(
      "useCurrentCoordinates must be used within a CurrentCoordinatesProvider"
    );
  }
  return context;
}

function CurrentCoordinatesProvider(props) {
  const [currentCoordinates, setCurrentCoordinatesInternal] = useState({
    latlng: { lat: 65, lng: 15 },
    zoom: 4,
  });

  function setCurrentCoordinates({ latlng, zoom }) {
    const newCoordinates = {
      latlng: latlng,
      zoom: zoom ?? currentCoordinates.zoom,
    };
    setCurrentCoordinatesInternal(newCoordinates);
  }

  return (
    <CurrentCoordinatesContext.Provider
      value={{ currentCoordinates, setCurrentCoordinates }}
      {...props}
    />
  );
}

export { CurrentCoordinatesProvider, useCurrentCoordinates };
