import { getAvailableYearsFromOGC } from 'apis/VegbilderOGC/getAvailableYearsFromOGC';
import { groupBy } from 'lodash';
import { DefaultValue, selector } from 'recoil';
import { IBbox, IImagePoint, ILatlng, queryParamterNames, viewTypes } from 'types';
import {
  getDateString,
  getFilteredImagePoints,
  groupBySeries,
} from 'utilities/imagePointUtilities';
import {
  currentImagePointState,
  currentLatLngZoomState,
  currentViewState,
  currentYearState,
  filteredImagePointsState,
  loadedImagePointsState,
} from './atoms';

export const availableYearsQuery = selector({
  key: 'availableYears',
  get: async () => {
    const response = await getAvailableYearsFromOGC();
    if (response.status === 200) {
      const regexp = RegExp(/20\d{2}/);

      let availableYears: number[] = [];
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');

      const titles = xmlDoc.getElementsByTagName('Title');

      for (const item of titles) {
        const yearMatches = item.innerHTML.match(regexp);
        if (yearMatches) {
          const year = parseInt(yearMatches[0]);
          if (!availableYears.includes(year)) {
            availableYears.push(year);
          }
        }
      }
      return availableYears.slice().sort((a: number, b: number) => b - a);
    }
    throw new Error('Karttjenesten er for øyeblikket utilgjengelig. Prøv igjen senere.');
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
  set: ({ get, set }, newImagePoint: IImagePoint | null | DefaultValue) => {
    if (!(newImagePoint instanceof DefaultValue)) {
      const imagePointId = newImagePoint ? newImagePoint.id : '';
      setNewQueryParamter('imageId', imagePointId);
      if (newImagePoint) {
        const loadedImagePoints = get(loadedImagePointsState);
        if (loadedImagePoints) {
          const filteredImagePoints = getFilteredImagePoints(loadedImagePoints, newImagePoint);
          set(filteredImagePointsState, filteredImagePoints);
        }
      }
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

export const loadedImagePointsFilterState = selector({
  key: 'loadedImagePointsFilterState',
  get: ({ get }) => {
    return get(loadedImagePointsState);
  },
  set: (
    { get, set },
    newLoadedImagePoints:
      | ({ imagePoints: IImagePoint[] } & { year: number } & { bbox: IBbox })
      | DefaultValue
      | null
  ) => {
    if (!(newLoadedImagePoints instanceof DefaultValue) && newLoadedImagePoints) {
      const imagePointsGroupedBySeries = groupBySeries(newLoadedImagePoints.imagePoints);
      const availableDates = getAvailableDates(newLoadedImagePoints.imagePoints);
      const newLoaded = {
        imagePoints: newLoadedImagePoints.imagePoints,
        year: newLoadedImagePoints.year,
        bbox: newLoadedImagePoints.bbox,
        imagePointsGroupedBySeries: imagePointsGroupedBySeries,
        availableDates: availableDates,
      };
      set(loadedImagePointsState, newLoaded);
      const currImagePoint = get(currentImagePointState);
      if (currImagePoint) {
        const filteredImagePoints = getFilteredImagePoints(newLoaded, currImagePoint);
        set(filteredImagePointsState, filteredImagePoints);
      }
    } else {
      set(loadedImagePointsState, null);
    }
  },
});

// utilities
const setNewQueryParamter = (name: queryParamterNames, value: string) => {
  const newSearchParams = new URLSearchParams(window.location.search);
  newSearchParams.set(name, value);
  window.history.replaceState(null, '', '?' + newSearchParams.toString());
};

const getAvailableDates = (imagePoints: IImagePoint[]) => {
  const imagePointsGroupedByDate = groupBy(imagePoints, (imagePoint) => getDateString(imagePoint));
  return Object.getOwnPropertyNames(imagePointsGroupedByDate);
};
