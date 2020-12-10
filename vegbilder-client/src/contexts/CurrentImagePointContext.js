import React, { useEffect, useState } from "react";
import _ from "lodash";

import useQueryParamState from "../hooks/useQueryParamState";
import { useLoadedImagePoints } from "./LoadedImagePointsContext";

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
  const { loadedImagePoints } = useLoadedImagePoints();
  const [currentImageId, setCurrentImageId] = useQueryParamState(
    "imageId",
    "",
    isValidImageId
  );
  const [currentImagePoint, setCurrentImagePointInternal] = useState(null);

  function setCurrentImagePoint(imagePoint) {
    setCurrentImagePointInternal(imagePoint);
    setCurrentImageId(imagePoint.id);
    console.log(imagePoint);
  }

  /* Initialize current image point based on currentImageId (from query param) once loadedImagePoints
   * has been populated. We have to find the actual image point with that id among the loaded image
   * points.
   */
  useEffect(() => {
    if (currentImagePoint == null && currentImageId !== "") {
      const imagePoint = _.find(
        loadedImagePoints.imagePoints,
        (ip) => ip.id === currentImageId
      );
      if (imagePoint) {
        setCurrentImagePointInternal(imagePoint);
        setCurrentImageId(imagePoint.id);
      }
    }
  }, [currentImageId, currentImagePoint, loadedImagePoints, setCurrentImageId]);

  return (
    <CurrentImagePointContext.Provider
      value={{ currentImagePoint, setCurrentImagePoint }}
      {...props}
    />
  );
}

function isValidImageId(imageId) {
  const regexp = /^[a-zA-Z\d-_\.]{1,100}$/;
  return regexp.test(imageId);
}

export { CurrentImagePointProvider, useCurrentImagePoint };
