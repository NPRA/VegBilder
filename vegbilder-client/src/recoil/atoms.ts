import { atom, useRecoilValue } from 'recoil';
import { availableYearsQuery } from './selectors';
import { ICoordinates } from './types';

//const availableYears = useRecoilValue(availableYearsQuery);

export const playVideoState = atom({
  key: 'playVideoState',
  default: false,
});

export const timerState = atom({
  key: 'timerState',
  default: 2000, // ms
});

export const currentYearState = atom({
  key: 'year',
  default: 2019,
});
