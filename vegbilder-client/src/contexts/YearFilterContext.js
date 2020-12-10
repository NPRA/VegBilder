import React, { useState } from "react";
import useQueryParamState from "../hooks/useQueryParamState";

const YearFilterContext = React.createContext();

const years = [2020, 2019];

function isValidYear(yearString) {
  const year = parseInt(yearString, 10);
  return year && years.includes(year);
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
    years[0],
    isValidYear
  );

  function setYear(year) {
    if (years.indexOf(year) !== -1) {
      setYearInternal(year);
    } else {
      throw new Error(`Tried to set invalid year: ${year}`);
    }
  }
  return <YearFilterContext.Provider value={{ year, setYear }} {...props} />;
}

export { YearFilterProvider, useYearFilter, years };
