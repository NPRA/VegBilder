import React, { useContext, createContext } from 'react';
import { availableYears, defaultYear } from 'configuration/config';
import useQueryParamState from 'hooks/useQueryParamState';

const YearFilterContext = createContext();

const useYearFilter = () => {
  const context = useContext(YearFilterContext);
  if (!context) {
    throw new Error('useYearFilter must be used within a YearFilterProvider');
  }
  return context;
};

const YearFilterProvider = (props) => {
  const [year, setYearInternal] = useQueryParamState('year', defaultYear);

  const setYear = (year) => {
    if (availableYears.includes(year)) {
      setYearInternal(year);
    } else {
      throw new Error(`Tried to set invalid year: ${year}`);
    }
  };
  return <YearFilterContext.Provider value={{ year, setYear }} {...props} />;
};

export { YearFilterProvider, useYearFilter };
