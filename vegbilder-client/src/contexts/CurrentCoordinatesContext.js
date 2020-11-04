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
    //latlng: { lat: 65, lng: 15 },
    latlng: { lat: 59.956997, lng: 11.070822 }, // Temporarily set a starting position suitable for testing and debugging. TODO: Replace with proper starting position
    zoom: 15,
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
