import { useRecoilState, useRecoilValue } from 'recoil';

import { loadedImagePointsState } from 'recoil/atoms';
import { availableYearsQuery, yearQueryParameterState, viewQueryParamterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

type fetchMethodNearestLatest = 'default' | 'findImagePointWithCustomRadius';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string,
  fetchMethodNearestLatest: fetchMethodNearestLatest = 'default',
) => {
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const availableYears = useRecoilValue(availableYearsQuery);

  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [, setView] = useRecoilState(viewQueryParamterState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder ved dette området. Prøv å klikke et annet sted.'
  );

  const fetchImagePointsByLatLongAndYearWithCustomRadius = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder på punktet du valgte. Velg et annet punkt.',
    'findImagePointWithCustomRadius'
  )

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng, radius?: number) {
    let foundImage = false;
    let fetchFunction = (fetchMethodNearestLatest === "findImagePointWithCustomRadius"
    ? fetchImagePointsByLatLongAndYearWithCustomRadius
    : fetchImagePointsByLatLongAndYear);
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        await fetchFunction(latlng, year, radius).then((imagePoint) => {
          if (imagePoint) {
            const year = imagePoint.properties.AAR;
            setCurrentYear(year);
            showMessage(
              `Avslutter nyeste og viser bilder fra ${year}, som er det året med de nyeste bildene i området.`
            );
            foundImage = true;
          }
        });
        if (foundImage) break;
      }
      if (!foundImage) {
          setView("map");
          setCurrentCoordinates({ ...currentCoordinates, zoom: 14 });
        showMessage(notFoundMessage);
      }
      return foundImage;
    }
  }

  return (latlng: ILatlng, radius?: number) => fetchImagePointsFromNewestYearByLatLng(latlng, radius);
};

export default useFetchNearestLatestImagePoint;
