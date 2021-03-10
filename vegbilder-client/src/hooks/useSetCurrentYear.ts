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
      //setQueryParamYear('latest');
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set('year', 'latest');
      window.history.replaceState(null, '', '?' + newSearchParams.toString());
      setCurrentYear('Nyeste');
    } else if (typeof newYear === 'number' && availableYears.includes(newYear)) {
      console.log(newYear);
      setCurrentYear(newYear);
      //setQueryParamYear(newYear.toString());
      const newSearchParams = new URLSearchParams(window.location.search);
      newSearchParams.set('year', newYear.toString());
      window.history.replaceState(null, '', '?' + newSearchParams.toString());
    }
  };

  return (newYear: string | number) => setNewYear(newYear);
};

export default useSetCurrentYear;
