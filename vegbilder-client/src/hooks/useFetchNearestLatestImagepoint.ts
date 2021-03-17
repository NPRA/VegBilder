import { useRecoilState, useRecoilValue } from 'recoil';

import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { availableYearsQuery, yearQueryParameterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string
) => {
  const { loadedImagePoints } = useLoadedImagePoints();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    'Fant inge bilder ved dette området. Prøv å klikke et annet sted.'
  );

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      let foundImage = false;
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        const imagePoint = await fetchImagePointsByLatLongAndYear(latlng, year);
        if (imagePoint) {
          const year = imagePoint.properties.AAR;
          setCurrentYear(year);
          showMessage(
            `Avslutter nyeste og viser bilder fra ${year}, som er det året med de nyeste bildene i området.`
          );
          foundImage = true;
          break;
        }
      }
      if (!foundImage) {
        showMessage(notFoundMessage);
      }
    }
  }

  return (latlng: ILatlng) => fetchImagePointsFromNewestYearByLatLng(latlng);
};

export default useFetchNearestLatestImagePoint;
