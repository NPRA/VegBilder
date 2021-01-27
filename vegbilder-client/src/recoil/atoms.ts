import { atom } from 'recoil';
import { IImagePoint } from 'types';

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
  default: parseInt(searchParams.get('year') || '2020'),
});

export const isHistoryModeState = atom({
  key: 'imageSeriesState',
  default: false,
});

export const currentHistoryImageState = atom<IImagePoint | null>({
  key: 'currentHistoryImage',
  default: null,
});
