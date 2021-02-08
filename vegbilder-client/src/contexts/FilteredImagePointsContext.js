import React, { useState } from 'react';
import { useEffect } from 'react';

import { useLoadedImagePoints } from './LoadedImagePointsContext';
import { useImageSeries } from './ImageSeriesContext';

const FilteredImagePointsContext = React.createContext();

function useFilteredImagePoints() {
  const context = React.useContext(FilteredImagePointsContext);
  if (!context) {
    throw new Error('useFilteredImagePoints must be used within a FilteredImagePointsProvider');
  }
  return context;
}

function FilteredImagePointsProvider(props) {
  const [filteredImagePoints, setFilteredImagePoints] = useState(null);
  const { loadedImagePoints } = useLoadedImagePoints();
  const { currentImageSeries } = useImageSeries();

  function resetFilteredImagePoints() {
    setFilteredImagePoints(null);
  }

  function findLatestImageSeries(availableImageSeries) {
    let latest = '0001-01-01';
    for (const imageSeriesDate of Object.getOwnPropertyNames(availableImageSeries)) {
      if (imageSeriesDate > latest) {
        latest = imageSeriesDate;
      }
    }
    return availableImageSeries[latest];
  }

  /* Filter the loaded image points, so that only one image series is displayed for each
   * road reference (ie. each lane of each part of the road). The newest series is selected
   * for each road reference. There will be one road reference which corresponds to the
   * currently selected series. That series is not necessarily the newest on its road reference,
   * so we include the image points from that series instead of the newest one.
   */
  useEffect(() => {
    if (loadedImagePoints?.imagePointsGroupedBySeries) {
      let filteredImagePoints = [];
      for (const [roadReference, availableImageSeriesForRoadReference] of Object.entries(
        loadedImagePoints.imagePointsGroupedBySeries
      )) {
        const imagePointsForRoadReference =
          roadReference === currentImageSeries?.roadReference
            ? availableImageSeriesForRoadReference[currentImageSeries.date]
            : findLatestImageSeries(availableImageSeriesForRoadReference);
        if (imagePointsForRoadReference) {
          filteredImagePoints = [...filteredImagePoints, ...imagePointsForRoadReference];
        }
      }
      setFilteredImagePoints(filteredImagePoints);
    }
  }, [currentImageSeries, loadedImagePoints]);

  return (
    <FilteredImagePointsContext.Provider
      value={{
        filteredImagePoints,
        setFilteredImagePoints,
        resetFilteredImagePoints,
      }}
      {...props}
    />
  );
}

export { FilteredImagePointsProvider, useFilteredImagePoints };
