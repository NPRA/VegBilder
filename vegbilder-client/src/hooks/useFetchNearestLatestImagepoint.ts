import { useRecoilState, useRecoilValue } from 'recoil';

import { currentImageTypeState, loadedImagePointsState } from 'recoil/atoms';
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
  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);
  const availableYearsPlanar = availableYearsForAllImageTypes['planar'];
  const availableYears360 = availableYearsForAllImageTypes['360'];
  
  const currentImageType = useRecoilValue(currentImageTypeState);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [, setView] = useRecoilState(viewQueryParamterState);
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const fetchImagePointsByLatLongAndYear = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder ved dette området. Prøv å klikke et annet sted.'
  );

  const fetchImagePointsByLatLongAndYearVegkartSearch = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder på punktet du valgte. Velg et annet punkt.',
    'vegkart'
  )

  async function fetchImagePointsFromNewestYearByLatLng(latlng: ILatlng) {
    let foundImage = false;
    let fetchFunction = (fetchMethodLatest === "vegkart"
    ? fetchImagePointsByLatLongAndYearVegkartSearch
    : fetchImagePointsByLatLongAndYear);

    let availableYears = currentImageType === '360' ? availableYears360 : availableYearsPlanar;

    if (!loadedImagePoints || currentYear === 'Nyeste') {
      for (const year of availableYears) {
        showMessage(`Leter etter bilder i ${year}...`);
        await fetchFunction(latlng, year, currentImageType).then((imagePoint) => {
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
