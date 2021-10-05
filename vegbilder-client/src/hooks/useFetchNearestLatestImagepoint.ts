import { useRecoilState, useRecoilValue } from 'recoil';

import { loadedImagePointsState } from 'recoil/atoms';
import { availableYearsQuery, yearQueryParameterState, viewQueryParamterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

type fetchMethodLatest = 'default' | 'vegkart';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string,
  fetchMethodLatest: fetchMethodLatest = 'default'
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

  const fetchImagePointsByLatLongAndYearNarrowSearch = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder på punktet du valgte. Velg et annet punkt.',
    'vegkart'
  )

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    let foundImage = false;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        if (fetchMethodLatest === "vegkart") {
          await fetchImagePointsByLatLongAndYearNarrowSearch(latlng, year).then((imagePoint) => {
            if (imagePoint) {
              const year = imagePoint.properties.AAR;
              setCurrentYear(year);
              showMessage(
                `Avslutter nyeste og viser bilder fra ${year}, som er det året med de nyeste bildene i området.`
              );
              foundImage = true;
            }
          });
        } else {
          await fetchImagePointsByLatLongAndYear(latlng, year).then((imagePoint) => {
            if (imagePoint) {
              const year = imagePoint.properties.AAR;
              setCurrentYear(year);
              showMessage(
                `Avslutter nyeste og viser bilder fra ${year}, som er det året med de nyeste bildene i området.`
              );
              foundImage = true;
            }
          });
        } if (foundImage) break;
      }
      if (!foundImage) {
        if (fetchMethodLatest === "vegkart") {
          setView("map");
          setCurrentCoordinates({ ...currentCoordinates, zoom: 14 });
        }
        showMessage(notFoundMessage);
      }
      return foundImage;
    }
  }

  return (latlng: ILatlng) => fetchImagePointsFromNewestYearByLatLng(latlng);
};

export default useFetchNearestLatestImagePoint;
