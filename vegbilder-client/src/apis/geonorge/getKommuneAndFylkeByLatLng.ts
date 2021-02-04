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
      throw error;
    });
};
