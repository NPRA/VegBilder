import React, { useState } from "react";
import { useEffect } from "react";

import { useCurrentImagePoint } from "./CurrentImagePointContext";
import { useLoadedImagePoints } from "./LoadedImagePointsContext";
import {
  getRoadReference,
  getDateString,
} from "../utilities/imagePointUtilities";

const ImageSeriesContext = React.createContext();

function useImageSeries() {
  const context = React.useContext(ImageSeriesContext);
  if (!context) {
    throw new Error("useImageSeries must be used within a ImageSeriesProvider");
  }
  return context;
}

function ImageSeriesProvider(props) {
  const [availableImageSeries, setAvailableImageSeries] = useState([]);
  const [currentImageSeries, setCurrentImageSeries] = useState(null);
  const { loadedImagePoints } = useLoadedImagePoints();
  const { currentImagePoint } = useCurrentImagePoint();

  /* Set the current image series and available image series (which may be selected on
   * this road reference) based on the loaded image points and the currently selected
   * image point. Note that we are using meterless road references here. So a road
   * reference in this case refers to a particular lane in a section of the road
   * (delstrekning or hovedparsell).
   */
  useEffect(() => {
    if (loadedImagePoints && currentImagePoint) {
      if (currentImagePoint) {
        const roadReference = getRoadReference(currentImagePoint).withoutMeter;
        const currentImageDate = getDateString(currentImagePoint);
        const imagePointsForRoadReferenceGroupedByDate =
          loadedImagePoints.imagePointsGroupedBySeries[roadReference];
        let availableDates = [];
        if (imagePointsForRoadReferenceGroupedByDate) {
          availableDates = Object.getOwnPropertyNames(
            imagePointsForRoadReferenceGroupedByDate
          );
        }
        setAvailableImageSeries(availableDates);
        setCurrentImageSeries({ roadReference, date: currentImageDate });
      } else {
        // No change
      }
    } else {
      setAvailableImageSeries([]);
      setCurrentImageSeries(null);
    }
  }, [loadedImagePoints, currentImagePoint]);

  return (
    <ImageSeriesContext.Provider
      value={{
        availableImageSeries,
        currentImageSeries,
        setCurrentImageSeries,
      }}
      {...props}
    />
  );
}

export { ImageSeriesProvider, useImageSeries };
