import wsgeonorge from './wsgeonorge';

export const getCoordinatesByPlace = async (place: string) => {
  return await wsgeonorge
    .get('/sok', {
      params: {
        navn: place,
        maxAnt: 2,
        epsgKode: 4326,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.sokStatus.ok) {
        return data;
      }
    });
  //return response;
};
