import vegbilderOGC from './vegbilderOGC';

export const getAvailableYears = async () => {
  return await vegbilderOGC
    .get('', {
      params: {
        service: 'WMS',
        version: '2.0.0',
        request: 'Getcapabilities',
        outputformat: 'application/json',
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      throw error;
    });
};
