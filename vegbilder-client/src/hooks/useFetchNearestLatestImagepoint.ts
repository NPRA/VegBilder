import { useRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";

import { loadedImagePointsState } from 'recoil/atoms';
import { availableYearsQuery, yearQueryParameterState, viewQueryParamterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

type fetchMethodNearestLatest = 'default' | 'findImagePointWithCustomRadius';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string, duration?: number) => void,
  notFoundMessage: string,
  fetchMethodNearestLatest: fetchMethodNearestLatest = 'default',
) => {
  const { t } = useTranslation('snackbar', {keyPrefix: "fetchMessage"});
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);
  const [currentYear,] = useRecoilState(yearQueryParameterState);
  const [, setView] = useRecoilState(viewQueryParamterState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    t('error2') 
  );

  const fetchImagePointsByLatLongAndYearWithCustomRadius = useFetchNearestImagePoint(
    showMessage,
    t('error3'),
    'findImagePointWithCustomRadius'
  )

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng, radius?: number) {
    let foundImage = false;
    let fetchFunction = (fetchMethodNearestLatest === "findImagePointWithCustomRadius"
    ? fetchImagePointsByLatLongAndYearWithCustomRadius
    : fetchImagePointsByLatLongAndYear);

    const availableYears = availableYearsForAllImageTypes['all'];

    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(t('searching', {year}));
        await fetchFunction(latlng, year, radius).then((imagePoint) => {
          if (imagePoint) {
            const year = imagePoint.properties.AAR;
            showMessage(
              t('imageFound', {year})
            );
            foundImage = true;
          }
        });
        if (foundImage) break;
      }
      if (!foundImage) {
        setView("map");
        setCurrentCoordinates({ ...currentCoordinates, zoom: 14 });
        if (fetchMethodNearestLatest === "findImagePointWithCustomRadius") {
          showMessage(notFoundMessage, 0);
        } else {
          showMessage(notFoundMessage);
        }
      }
      return foundImage;
    }
  }

  return (latlng: ILatlng, radius?: number) => fetchImagePointsFromNewestYearByLatLng(latlng, radius);
};

export default useFetchNearestLatestImagePoint;
