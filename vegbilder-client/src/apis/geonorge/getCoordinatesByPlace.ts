import wsgeonorge from './wsgeonorge';

export const getCoordinatesByPlace = async (place: string) => {
  return await wsgeonorge
    .get('/sok', {
      params: {
        navn: `${place}*`,
        maxAnt: 10,
        epsgKode: 4326,
        eksakteForst: true,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.sokStatus.ok) {
        return data;
      }
    });
};
