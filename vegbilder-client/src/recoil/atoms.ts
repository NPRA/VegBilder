import { DEFAULT_COORDINATES } from 'constants/defaultParamters';
import { atom } from 'recoil';
import { IImagePoint, ILatlng } from 'types';

const searchParams = new URLSearchParams(window.location.search);

export const playVideoState = atom<boolean>({
  key: 'playVideoState',
  default: false,
});

export const currentYearState = atom<string | number>({
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

export const currentImagePointState = atom<IImagePoint | null>({
  key: 'currentImagePoint',
  default: null,
});

export const currentLatLngState = atom<ILatlng>({
  key: 'currentLatLng',
  default: { lat: DEFAULT_COORDINATES.lat, lng: DEFAULT_COORDINATES.lng },
});

export const currentZoomState = atom<number>({
  key: 'currentZoom',
  default: 4,
});
