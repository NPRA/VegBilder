import { defaultCoordinates } from 'constants/constants';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { availableYearsQuery } from 'recoil/selectors';

type queryParamterNames = 'imageId' | 'year' | 'view' | 'lat' | 'lng' | 'zoom';

const useQueryParamState = (name: queryParamterNames) => {
  const searchParams = new URLSearchParams(window.location.search);

  const availableYears = useRecoilValue(availableYearsQuery);

  const isValidImageId = (imageId: string) => {
    const regexp = /^[a-zA-Z\d-_.]{1,100}$/;
    return regexp.test(imageId);
  };

  const isValidYear = (year: number) => availableYears.includes(year);
  const isValidView = (view: string) => view === 'map' || view === 'image';

  const isDefaultCoordinates = () => {
    const lat = searchParams.get('lat');
    const lng = searchParams.get('lng');
    return (
      lat === null ||
      lng === null ||
      (lat === defaultCoordinates.lat && lng === defaultCoordinates.lng)
    );
  };

  const getSearchParam = (name: string) => {
    const searchParam = searchParams.get(name);
    switch (name) {
      case 'imageId':
        if (searchParam) {
          const validImageIdParam = isValidImageId(searchParam);
          if (!validImageIdParam) {
            throw new Error(`Ugyldig id for bilde: ${searchParam}`);
          }
          return searchParam;
        }
        return '';
      case 'year':
        const defaultYear = 'latest';
        if (searchParam) {
          const validYearParam = isValidYear(parseInt(searchParam)) || searchParam === 'latest';
          if (!validYearParam) {
            throw new Error(`Ugyldig verdi for år: ${searchParam}`);
          }
          return searchParam;
        }
        return defaultYear;
      case 'view':
        if (searchParam) {
          const validView = isValidView(searchParam);
          if (!validView) {
            throw new Error(`Ugyldig view: ${searchParam}`);
          }
          return searchParam;
        }
        return 'map';
      case 'lat':
        return searchParam || '65';
      case 'lng':
        return searchParam || '15';
      case 'zoom':
        if (!searchParam) {
          if (!isDefaultCoordinates()) return '15';
        }
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
