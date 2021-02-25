import { atom } from 'recoil';
import { IImagePoint } from 'types';

const searchParams = new URLSearchParams(window.location.search);

export const playVideoState = atom<boolean>({
  key: 'playVideoState',
  default: false,
});

export const currentYearState = atom({
  key: 'currentYear',
  default: parseInt(searchParams.get('year')!) || 'Nyeste',
});

export const isHistoryModeState = atom({
  key: 'imageSeriesState',
  default: false,
});

export const currentHistoryImageState = atom<IImagePoint | null>({
  key: 'currentHistoryImage',
  default: null,
});
