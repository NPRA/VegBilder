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
      console.warn(error);
    });
};

export default getVegByVegsystemreferanse;
