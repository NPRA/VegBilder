import { useRecoilState, useRecoilValue } from 'recoil';

import { loadedImagePointsState } from 'recoil/atoms';
import { availableYearsQuery, yearQueryParameterState, viewQueryParamterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

type action = 'default' | 'fromVegkart';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string
) => {
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const availableYears = useRecoilValue(availableYearsQuery);

  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [, setView] = useRecoilState(viewQueryParamterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder ved dette området. Prøv å klikke et annet sted.'
  );

  const fetchImagePointsByLatLongAndYearVegkart = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder på punktet du valgte. Velg et annet punkt.',
    'fromVegkart'
  )

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng, action: action) {
    let foundImage = false;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        if (action === "fromVegkart") {
          await fetchImagePointsByLatLongAndYearVegkart(latlng, year).then((imagePoint) => {
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
        if (action === "fromVegkart") {
          setView("map");
        }
        showMessage(notFoundMessage);
      }
      return foundImage;
    }
  }

  return (latlng: ILatlng, action: action) => fetchImagePointsFromNewestYearByLatLng(latlng, action);
};

export default useFetchNearestLatestImagePoint;
