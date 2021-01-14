import { atom } from 'recoil';

const searchParams = new URLSearchParams(window.location.search);

export const playVideoState = atom({
  key: 'playVideoState',
  default: false,
});

export const timerState = atom({
  key: 'timerState',
  default: 2000, // ms
});

export const currentYearState = atom({
  key: 'currentYear',
  default: searchParams.get('year') || 2020,
});

export const currentImagePointState = atom({
  key: 'currentImagePoint',
  default: '',
});
