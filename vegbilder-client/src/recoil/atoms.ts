import { atom } from 'recoil';
import { IImagePoint } from 'types';

const searchParams = new URLSearchParams(window.location.search);

export const playVideoState = atom<boolean>({
  key: 'playVideoState',
  default: false,
});

export const timerState = atom<number>({
  key: 'timerState',
  default: 2000, // ms
});

export const currentYearState = atom<string | number>({
  key: 'currentYear',
  default: searchParams.get('year') ? parseInt(searchParams.get('year') || '') : 'Nyeste',
});

export const isHistoryModeState = atom({
  key: 'imageSeriesState',
  default: false,
});

export const currentHistoryImageState = atom<IImagePoint | null>({
  key: 'currentHistoryImage',
  default: null,
});
