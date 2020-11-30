import React, { useState } from "react";

const ImageSeriesContext = React.createContext();

function useImageSeries() {
  const context = React.useContext(ImageSeriesContext);
  if (!context) {
    throw new Error("useImageSeries must be used within a ImageSeriesProvider");
  }
  return context;
}

function ImageSeriesProvider(props) {
  const [
    currentImageSeriesRoadContext,
    setCurrentImageSeriesRoadContext,
  ] = useState(null);
  const [availableImageSeries, setAvailableImageSeries] = useState([]);
  const [currentImageSeries, setCurrentImageSeries] = useState(null);
  return (
    <ImageSeriesContext.Provider
      value={{
        currentImageSeriesRoadContext,
        setCurrentImageSeriesRoadContext,
        availableImageSeries,
        setAvailableImageSeries,
        currentImageSeries,
        setCurrentImageSeries,
      }}
      {...props}
    />
  );
}

export { ImageSeriesProvider, useImageSeries };
