import { ILatlng } from 'types';
import wsgeonorge from './wsgeonorge';

export const GetKommuneAndFylkeByLatLng = async (latlng: ILatlng) => {
  return await wsgeonorge
    .get('kommuneinfo/v1/punkt', {
      params: {
        nord: latlng.lat,
        ost: latlng.lng,
        koordsys: 4326,
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.warn('bad response from nvdb api. ' + error.message);
        return 'Error ' + error;
      } else if (error.request) {
        // client never received a response, or request never left
        console.warn('Didnt receive a response from wsgeonorge ' + error.message);
        return 'Error ' + error;
      } else {
        // anything else
        console.warn('An unknown error occured ' + error.message);
        return 'Error ' + error;
      }
    });
};
