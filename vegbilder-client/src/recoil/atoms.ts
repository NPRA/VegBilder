import { atom } from 'recoil';
import { ICoordinates } from './types';

export const playVideoState = atom({
  key: 'playVideoState',
  default: false,
});

export const timerState = atom({
  key: 'timerState',
  default: 2000, // ms
});

export const coordinatesState = atom<ICoordinates>({
  key: 'cordinatesState',
  default: { latlng: { lat: 65, lng: 15 }, zoom: 4 },
});
