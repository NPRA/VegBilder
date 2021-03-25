import vegbilderOGC from './vegbilderOGC';

export const getAvailableYearsFromOGC = async () => {
  return await vegbilderOGC
    .get('', {
      params: {
        service: 'WMS',
        version: '2.0.0',
        request: 'Getcapabilities',
        outputformat: 'application/json',
      },
    })
    .then((ogcCapabilities) => {
      return ogcCapabilities;
    })
    .catch((error) => {
      return error;
    });
};
