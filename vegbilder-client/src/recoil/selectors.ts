import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { DefaultValue, selector } from 'recoil';
import { IImagePoint, ILatlng, queryParamterNames, viewTypes } from 'types';
import { getDateString, getRoadReference } from 'utilities/imagePointUtilities';
import {
  currentImagePointState,
  currentLatLngZoomState,
  currentViewState,
  currentYearState,
  loadedImagePoints,
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

// LatLng and zoom must be the same state in order to render leaflet map properly on state change.
export const latLngZoomQueryParameterState = selector({
  key: 'latLngQueryParamterState',
  get: ({ get }) => {
    return get(currentLatLngZoomState);
  },
  set: ({ set }, newCoordinates: (ILatlng & { zoom?: number }) | DefaultValue) => {
    if (!(newCoordinates instanceof DefaultValue)) {
      setNewQueryParamter('lat', newCoordinates.lat.toString());
      setNewQueryParamter('lng', newCoordinates.lng.toString());
      if (newCoordinates.zoom) setNewQueryParamter('zoom', newCoordinates.zoom.toString());
    }
    set(currentLatLngZoomState, newCoordinates);
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

export const loadedImagePointsState = selector({
  key: 'loadedImagePointsState',
  get: ({ get }) => {
    return get(loadedImagePoints);
  },
});

// utilities

const setNewQueryParamter = (name: queryParamterNames, value: string) => {
  const newSearchParams = new URLSearchParams(window.location.search);
  newSearchParams.set(name, value);
  window.history.replaceState(null, '', '?' + newSearchParams.toString());
};

// const setStuff = (currentImagePoint: IImagePoint) => {
//   const roadReference = getRoadReference(currentImagePoint).withoutMeter;
//   const currentImageDate = getDateString(currentImagePoint);
//   const imagePointsForRoadReferenceGroupedByDate =
//     loadedImagePoints.imagePointsGroupedBySeries[roadReference];
//   let availableDates: string[] = [];
//   if (imagePointsForRoadReferenceGroupedByDate) {
//     availableDates = Object.getOwnPropertyNames(imagePointsForRoadReferenceGroupedByDate);
//   }
//   return availableDates;
// };
