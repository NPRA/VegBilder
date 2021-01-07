import { availableYears } from 'configuration/config';
import { useEffect, useState } from 'react';

type queryParamterNames = 'coordinates' | 'imageId' | 'year' | 'view' | 'lat' | 'lang' | 'zoom';

const isValidImageId = (imageId: string) => {
  const regexp = /^[a-zA-Z\d-_.]{1,100}$/;
  return regexp.test(imageId);
};

const isValidYear = (year: number) => availableYears.includes(year);
const isValidView = (view: string) => view === 'map' || view === 'image';

const isValidCoordinateString = (coordinates: string) => {
  const regexp = /^(\d*(\.\d*)?,){2}\d{1,2}$/;
  return regexp.test(coordinates);
};

const useQueryParamState = (name: queryParamterNames, defaultValue: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchParam = searchParams.get(name);

  const getValidatedSearchParam = (name: string) => {
    if (!searchParam) return;

    switch (name) {
      case 'imageId':
        const validImageIdParam = isValidImageId(searchParam);
        if (!validImageIdParam) {
          throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
        }
        return searchParam;
      case 'year':
        const validYearParam = isValidYear(parseInt(searchParam));
        if (!validYearParam) {
          throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
        }
        return searchParam;
      case 'view':
        const validView = isValidView(searchParam);
        if (!validView) {
          throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
        }
        return searchParam;
      case 'coordinates':
        const validCoordinates = isValidCoordinateString(searchParam);
        if (!validCoordinates) {
          throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
        }
        return searchParam;
    }
  };

  const [state, setState] = useState<string>(getValidatedSearchParam(name) || defaultValue);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, '', '?' + newSearchParams.toString());
  }, [name, state]);

  return [state, setState] as const;
};

export default useQueryParamState;
