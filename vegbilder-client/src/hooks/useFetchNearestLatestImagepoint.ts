import { useRecoilState, useRecoilValue } from 'recoil';

import { currentCameraTypeState, loadedImagePointsState } from 'recoil/atoms';
import { availableYearsQuery, yearQueryParameterState } from 'recoil/selectors';
import { ILatlng } from 'types';
import useFetchNearestImagePoint from './useFetchNearestImagePoint';

const useFetchNearestLatestImagePoint = (
  showMessage: (message: string) => void,
  notFoundMessage: string
) => {
  const loadedImagePoints = useRecoilValue(loadedImagePointsState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentCameraType = useRecoilValue(currentCameraTypeState);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder ved dette området. Prøv å klikke et annet sted.'
  );

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    let foundImage = false;
    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        await fetchImagePointsByLatLongAndYear(latlng, year, currentCameraType).then((imagePoint) => {
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
        showMessage(notFoundMessage);
      }
      return foundImage;
    }
  }

  return (latlng: ILatlng) => fetchImagePointsFromNewestYearByLatLng(latlng);
};

export default useFetchNearestLatestImagePoint;
