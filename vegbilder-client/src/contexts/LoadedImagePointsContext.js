import React, { useState } from "react";

const LoadedImagePointsContext = React.createContext();

function useLoadedImagePoints() {
  const context = React.useContext(LoadedImagePointsContext);
  if (!context) {
    throw new Error(
      "useLoadedImagePoints must be used within a LoadedImagePointsProvider"
    );
  }
  return context;
}

function LoadedImagePointsProvider(props) {
  const [loadedImagePoints, setLoadedImagePoints] = useState(null);
  return (
    <LoadedImagePointsContext.Provider
      value={{ loadedImagePoints, setLoadedImagePoints }}
      {...props}
    />
  );
}

export { LoadedImagePointsProvider, useLoadedImagePoints };
