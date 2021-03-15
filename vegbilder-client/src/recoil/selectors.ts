import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { DefaultValue, selector } from 'recoil';
import { IImagePoint, ILatlng, queryParamterNames, viewTypes } from 'types';
import {
  currentImagePointState,
  currentLatLngState,
  currentViewState,
  currentYearState,
  currentZoomState,
} from './atoms';

export const availableYearsQuery = selector({
  key: 'availableYears',
  get: async () => {
    const response = await getAvailableYearsFromOGC();
    return response.slice().sort((a, b) => b - a);
  },
});

export const yearQueryParameterState = selector({
  key: 'yearQueryParamterState',
  get: ({ get }) => {
    return get(currentYearState);
  },
  set: ({ get, set }, newYear) => {
    if (newYear === 'Nyeste') {
      setNewQueryParamter('year', 'latest');
      set(currentYearState, newYear);
    } else if (typeof newYear === 'number' && get(availableYearsQuery).includes(newYear)) {
      setNewQueryParamter('year', newYear.toString());
      set(currentYearState, newYear);
    }
  },
});

export const imagePointQueryParameterState = selector({
  key: 'imagePointQueryParamterState',
  get: ({ get }) => {
    return get(currentImagePointState);
  },
  set: ({ set }, newImagePoint: IImagePoint | null | DefaultValue) => {
    if (!(newImagePoint instanceof DefaultValue)) {
      const imagePointId = newImagePoint ? newImagePoint.id : '';
      setNewQueryParamter('imageId', imagePointId);
    }
    set(currentImagePointState, newImagePoint);
  },
});

export const latLngQueryParameterState = selector({
  key: 'latLngQueryParamterState',
  get: ({ get }) => {
    return get(currentLatLngState);
  },
  set: ({ set }, newCoordinates: ILatlng | DefaultValue) => {
    if (!(newCoordinates instanceof DefaultValue)) {
      setNewQueryParamter('lat', newCoordinates.lat.toString());
      setNewQueryParamter('lng', newCoordinates.lng.toString());
    }
    set(currentLatLngState, newCoordinates);
  },
});

export const zoomQueryParameterState = selector({
  key: 'zoomQueryParamterState',
  get: ({ get }) => {
    return get(currentZoomState);
  },
  set: ({ set }, zoom: number | DefaultValue) => {
    if (!(zoom instanceof DefaultValue)) {
      setNewQueryParamter('zoom', zoom.toString());
    }
    set(currentZoomState, zoom);
  },
});

export const viewQueryParamterState = selector({
  key: 'viewQueryParamterState',
  get: ({ get }) => {
    return get(currentViewState);
  },
  set: ({ set }, view: viewTypes | DefaultValue) => {
    if (!(view instanceof DefaultValue)) {
      setNewQueryParamter('view', view);
    }
    set(currentViewState, view);
  },
});

const setNewQueryParamter = (name: queryParamterNames, value: string) => {
  const newSearchParams = new URLSearchParams(window.location.search);
  newSearchParams.set(name, value);
  window.history.replaceState(null, '', '?' + newSearchParams.toString());
};
