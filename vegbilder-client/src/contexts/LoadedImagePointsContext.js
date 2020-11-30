import React, { useState } from "react";

import { groupBySeries } from "../utilities/imagePointUtilities";

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
  const [loadedImagePoints, setLoadedImagePointsInternal] = useState([]);

  function setLoadedImagePoints(imagePoints) {
    if (imagePoints.imagePoints === undefined) {
      throw new Error(
        "imagePoints must be defined when setting loadedImagePoints"
      );
    }
    if (!imagePoints.bbox) {
      throw new Error("Must set bbox for loadedImagePoints");
    }
    if (!imagePoints.timePeriod) {
      throw new Error("Must set timePeriod for loadedImagePoints");
    }
    imagePoints.imagePointsGroupedBySeries = groupBySeries(
      imagePoints.imagePoints
    );
    setLoadedImagePointsInternal(imagePoints);
  }
  return (
    <LoadedImagePointsContext.Provider
      value={{
        loadedImagePoints,
        setLoadedImagePoints,
      }}
      {...props}
    />
  );
}

export { LoadedImagePointsProvider, useLoadedImagePoints };
