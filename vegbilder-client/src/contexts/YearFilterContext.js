import React from "react";
import useQueryParamState from "../hooks/useQueryParamState";
import { availableYears, defaultYear } from "../configuration/config";

const YearFilterContext = React.createContext();

function isValidYear(yearString) {
  const year = parseInt(yearString, 10);
  return Number.isFinite(year) && availableYears.includes(year);
}

function useYearFilter() {
  const context = React.useContext(YearFilterContext);
  if (!context) {
    throw new Error("useYearFilter must be used within a YearFilterProvider");
  }
  return context;
}

function YearFilterProvider(props) {
  const [year, setYearInternal] = useQueryParamState(
    "year",
    defaultYear,
    isValidYear,
    true
  );

  function setYear(year) {
    if (availableYears.includes(year)) {
      setYearInternal(year);
    } else {
      throw new Error(`Tried to set invalid year: ${year}`);
    }
  }
  return <YearFilterContext.Provider value={{ year, setYear }} {...props} />;
}

export { YearFilterProvider, useYearFilter };
