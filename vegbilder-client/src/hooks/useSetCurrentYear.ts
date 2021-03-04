import { useRecoilValue, useRecoilState } from 'recoil';
import { currentYearState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';
import useQueryParamState from './useQueryParamState';

const useSetCurrentYear = () => {
  const [, setQueryParamYear] = useQueryParamState('year');
  const availableYears = useRecoilValue(availableYearsQuery);
  const [, setCurrentYear] = useRecoilState(currentYearState);

  const setNewYear = (newYear: number | string) => {
    if (newYear === 'Nyeste') {
      setQueryParamYear('latest');
      setCurrentYear('Nyeste');
    } else if (typeof newYear === 'number' && availableYears.includes(newYear)) {
      setCurrentYear(newYear);
      setQueryParamYear(newYear.toString());
    }
  };

  return (newYear: string | number) => setNewYear(newYear);
};

export default useSetCurrentYear;
