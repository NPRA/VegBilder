import { ILatlng } from 'types';
import nvdbApi from './nvdbApi';

const GetPositionDataByLatLng = async (latlng: ILatlng) => {
  return await nvdbApi
    .get(`/posisjon`, {
      params: {
        lat: latlng.lat,
        lon: latlng.lng,
        maks_antall: 1,
        maks_avstand: 20,
        srid: '4326',
        detaljerte_lenker: 'false',
        konnekteringslenker: 'false',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.warn('bad response from nvdb api. ' + error.message);
      } else if (error.request) {
        // client never received a response, or request never left
        console.warn('Didnt receive a response from nvdb ' + error.message);
      } else {
        // anything else
        console.warn('An unknown error occured ' + error.message);
      }
    });
};

export default GetPositionDataByLatLng;
