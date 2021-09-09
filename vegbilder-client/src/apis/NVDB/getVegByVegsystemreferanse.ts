import nvdbApi from './nvdbApi';

const getVegByVegsystemreferanse = async (vegsystemreferanse: string) => {
  return await nvdbApi
    .get('/veg', {
      params: {
        vegsystemreferanse: vegsystemreferanse,
        srid: '4326',
      },
    })
    .then((response) => {
      if (response.status === 4012) {
        console.warn(response.statusText);
        return;
      }
      return response;
    })
    .catch((error) => {
      if (error.message === 'Request failed with status code 404') {
        console.warn(error); // if it doesn't find the road-reference
      } else {
        return error;
      }
    });
};

export default getVegByVegsystemreferanse;
