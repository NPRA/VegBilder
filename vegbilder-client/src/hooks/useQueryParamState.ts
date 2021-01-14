import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { availableYearsQuery } from 'recoil/selectors';

type queryParamterNames = 'imageId' | 'year' | 'view' | 'lat' | 'lng' | 'zoom';

const useQueryParamState = (name: queryParamterNames, defaultValue?: string) => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchParam = searchParams.get(name);
  const availableYears = useRecoilValue(availableYearsQuery);

  const isValidImageId = (imageId: string) => {
    const regexp = /^[a-zA-Z\d-_.]{1,100}$/;
    return regexp.test(imageId);
  };

  const isValidYear = (year: number) => availableYears.includes(year);
  const isValidView = (view: string) => view === 'map' || view === 'image';

  const getSearchParam = (name: string) => {
    switch (name) {
      case 'imageId':
        if (searchParam) {
          const validImageIdParam = isValidImageId(searchParam);
          if (!validImageIdParam) {
            throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
          }
          return searchParam;
        }
        return '';
      case 'year':
        const defaultYear = availableYears[0].toString();
        if (searchParam) {
          const validYearParam = isValidYear(parseInt(searchParam));
          if (!validYearParam) {
            throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
          }
          return searchParam;
        }
        return defaultYear;
      case 'view':
        if (searchParam) {
          const validView = isValidView(searchParam);
          if (!validView) {
            throw new Error(`Invalid value of query parameter ${name}: ${searchParam}`);
          }
          return searchParam;
        }
        return 'map';
      case 'lat':
        return searchParam || '65';
      case 'lng':
        return searchParam || '15';
      case 'zoom':
        return searchParam || '4';
      default:
        return '';
    }
  };

  const [state, setState] = useState<string>(getSearchParam(name));

  useEffect(() => {
    const newSearchParams = new URLSearchParams(window.location.search);
    newSearchParams.set(name, state);
    window.history.replaceState(null, '', '?' + newSearchParams.toString());
  }, [name, state]);

  return [state, setState] as const;
};

export default useQueryParamState;
