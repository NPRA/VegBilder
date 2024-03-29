import { DEFAULT_COORDINATES } from 'constants/defaultParamters';
import { defaultPannellumSettings } from "constants/settings";
import { atom } from 'recoil';
import { IImagePoint, ILatlng, ILoadedImagePoints, viewTypes } from 'types';
import { IStatisticsFeature } from "components/PageInformation/tabs/Teknisk/StatisticsTable/types";

const searchParams = new URLSearchParams(window.location.search);

export const playVideoState = atom<boolean>({
  key: 'playVideoState',
  default: false,
});

export const currentYearState = atom<string | number>({
  key: 'currentYear',
  default: parseInt(searchParams.get('year')!) || 'Nyeste' || '',
});

export const currentVegsystemreferanseState = atom<string | null>({
  key: 'currentVegsystemreferanse',
  default: null
})

export const currentImagePointState = atom<IImagePoint | null>({
  key: 'currentImagePoint',
  default: null,
});

// LatLng and zoom must be the same state in order to render leaflet map properly on state change.
export const currentLatLngZoomState = atom<ILatlng & { zoom: number }>({
  key: 'currentLatLngZoom',
  default: {
    lat: parseFloat(searchParams.get('lat')!) || DEFAULT_COORDINATES.lat,
    lng: parseFloat(searchParams.get('lng')!) || DEFAULT_COORDINATES.lng,
    zoom: 4,
  },
});

export const currentViewState = atom<viewTypes>({
  key: 'currentView',
  default: searchParams.get('view') === 'image' ? 'image' : 'map',
});

export const availableDatesForImageSeries = atom<string[]>({
  key: 'availableDatesForImageSeries',
  default: [],
});

export const loadedImagePointsState = atom<ILoadedImagePoints | null>({
  key: 'loadedImagePoints',
  default: null,
});

export const filteredImagePointsState = atom<IImagePoint[] | null>({
  key: 'filteredImagePoints',
  default: null,
});

export const availableStatistics = atom<IStatisticsFeature[] | null>({
  key: 'availableStatistics',
  default: [],
});

export const currentPannellumHfovState = atom<number>({
  key: 'currentPannellumHfovState',
  default: defaultPannellumSettings.defaultHfov,
});

export const panoramaFullscreenIsOnState = atom<boolean>({
  key: 'panoramaFullscreenIsOnState',
  default: false,
});

export const isPanoramaMinOrMaxZoomState = atom<{isMinZoom: boolean, isMaxZoom: boolean}>({
  key: 'isPanoramaMinOrMaxZoomState',
  default: defaultPannellumSettings.minOrMaxZoom,
})