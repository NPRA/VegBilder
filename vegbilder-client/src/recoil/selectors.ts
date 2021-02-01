import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { selector } from 'recoil';

export const availableYearsQuery = selector({
  key: 'availableYears',
  get: async () => {
    const response = await getAvailableYearsFromOGC();
    return response.slice().sort((a, b) => b - a);
  },
});
