import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { selector } from 'recoil';
import { currentYearState } from './atoms';

export const availableYearsQuery = selector({
  key: 'availableYears',
  get: async () => {
    const response = await getAvailableYearsFromOGC();
    return response.slice().sort((a, b) => b - a);
  },
});

export const yearQueryParameterState = selector({
  key: 'yearQueryParamterState',
  get: ({ get }) => {
    return get(currentYearState);
  },
  set: ({ get, set }, newYear) => {
    const newSearchParams = new URLSearchParams(window.location.search);
    if (newYear === 'Nyeste') {
      newSearchParams.set('year', 'latest');
      window.history.replaceState(null, '', '?' + newSearchParams.toString());
      set(currentYearState, newYear);
    } else if (typeof newYear === 'number' && get(availableYearsQuery).includes(newYear)) {
      newSearchParams.set('year', newYear.toString());
      window.history.replaceState(null, '', '?' + newSearchParams.toString());
      set(currentYearState, newYear);
    }
  },
});
