import { defaultCoordinates } from 'constants/constants';
import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { availableYearsQuery } from 'recoil/selectors';

type queryParamterNames = 'imageId' | 'year' | 'view' | 'lat' | 'lng' | 'zoom';

const useQueryParamState = (name: queryParamterNames) => {
  const searchParams = new URLSearchParams(window.location.search);
  const searchParam = searchParams.get(name);
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
    if (lat && lat !== defaultCoordinates.lat && lng && lng !== defaultCoordinates.lng)
      return false;
    return true;
  };

  const getSearchParam = (name: string) => {
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
        let defaultYear;
        if (isDefaultCoordinates()) {
          defaultYear = 'Nyeste';
        } else {
          defaultYear = availableYears[0].toString();
        }
        if (searchParam) {
          const validYearParam = isValidYear(parseInt(searchParam)) || searchParam === 'Nyeste';
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
