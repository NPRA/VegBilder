import { atom } from 'recoil';
import { ICoordinates } from './types';

const urlParams = new URLSearchParams(window.location.search);
const lat = urlParams.get('lat');
const lng = urlParams.get('lng');
const zoom = urlParams.get('zoom');

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
  default: {
    latlng: { lat: lat ? parseInt(lat) : 65, lng: lng ? parseInt(lng) : 15 },
    zoom: zoom ? parseInt(zoom) : 4,
  },
});
