import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { selector } from 'recoil';

export const availableYearsQuery = selector({
  key: 'availableYears',
  get: async ({ get }) => {
    const response = await getAvailableYearsFromOGC();
    return response;
  },
});
