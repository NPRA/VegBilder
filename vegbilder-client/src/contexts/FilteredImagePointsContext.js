import React, { useState } from "react";

const FilteredImagePointsContext = React.createContext();

function useFilteredImagePoints() {
  const context = React.useContext(FilteredImagePointsContext);
  if (!context) {
    throw new Error(
      "useFilteredImagePoints must be used within a FilteredImagePointsProvider"
    );
  }
  return context;
}

function FilteredImagePointsProvider(props) {
  const [filteredImagePoints, setFilteredImagePoints] = useState([]);
  return (
    <FilteredImagePointsContext.Provider
      value={{
        filteredImagePoints,
        setFilteredImagePoints,
      }}
      {...props}
    />
  );
}

export { FilteredImagePointsProvider, useFilteredImagePoints };
