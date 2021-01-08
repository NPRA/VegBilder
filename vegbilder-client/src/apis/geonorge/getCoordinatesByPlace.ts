import wsgeonorge from './wsgeonorge';

export const getCoordinatesByPlace = async (place: string) => {
  const response = await wsgeonorge.get('/sok', {
    params: {
      navn: place,
      maxAnt: 10,
    },
  });
  return response;
};
