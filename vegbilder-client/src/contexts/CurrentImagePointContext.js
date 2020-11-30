import React, { useState } from "react";

import { useLoadedImagePoints } from "./LoadedImagePointsContext";
import { useImageSeries } from "./ImageSeriesContext";
import {
  getRoadContextString,
  getDateString,
} from "../utilities/imagePointUtilities";

const CurrentImagePointContext = React.createContext();

function useCurrentImagePoint() {
  const context = React.useContext(CurrentImagePointContext);
  if (!context) {
    throw new Error(
      "useCurrentImagePoint must be used within a CurrentImagePointProvider"
    );
  }
  return context;
}

function CurrentImagePointProvider(props) {
  const [currentImagePoint, setCurrentImagePointInternal] = useState(null);
  const { loadedImagePoints } = useLoadedImagePoints();
  const {
    setCurrentImageSeriesRoadContext,
    setAvailableImageSeries,
    setCurrentImageSeries,
  } = useImageSeries();

  function setCurrentImagePoint(imagePoint) {
    setCurrentImagePointInternal(imagePoint);
    console.log(imagePoint);
    if (imagePoint) {
      const roadContext = getRoadContextString(imagePoint);
      const date = getDateString(imagePoint);
      const imagePointsForRoadContextGroupedByDate =
        loadedImagePoints.imagePointsGroupedBySeries[roadContext];
      let availableImageSeries = [];
      if (imagePointsForRoadContextGroupedByDate) {
        availableImageSeries = Object.getOwnPropertyNames(
          imagePointsForRoadContextGroupedByDate
        );
      }
      setCurrentImageSeriesRoadContext(roadContext);
      setCurrentImageSeries(date);
      setAvailableImageSeries(availableImageSeries);

      console.log("Road context for image series: " + roadContext);
      console.log(availableImageSeries);
      console.log("Current image series: " + date);
    }
  }
  return (
    <CurrentImagePointContext.Provider
      value={{ currentImagePoint, setCurrentImagePoint }}
      {...props}
    />
  );
}

export { CurrentImagePointProvider, useCurrentImagePoint };
