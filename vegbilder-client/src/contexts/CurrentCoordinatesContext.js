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
  const [currentCoordinates, setCurrentCoordinates] = useState({
    latlng: [65, 15],
    zoom: 4,
  });
  return (
    <CurrentCoordinatesContext.Provider
      value={{ currentCoordinates, setCurrentCoordinates }}
      {...props}
    />
  );
}

export { CurrentCoordinatesProvider, useCurrentCoordinates };
