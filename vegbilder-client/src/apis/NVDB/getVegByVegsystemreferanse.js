import nvdbApi from './nvdbApi';

const getVegByVegsystemreferanse = async (vegsystemreferanse) => {
  return await nvdbApi
    .get('/veg', {
      params: {
        vegsystemreferanse: vegsystemreferanse,
        srid: '4326',
      },
    })
    .then((response) => {
      if (response.code === 4012) {
        console.warn(response.message);
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
