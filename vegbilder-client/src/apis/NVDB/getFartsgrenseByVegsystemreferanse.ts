import nvdbApi from './nvdbApi';

const getFartsgrenseByVegsystemreferanse = async (vegsystemreferanse: string) => {
  return await nvdbApi
    .get('/vegobjekter/105', {
      params: {
        vegsystemreferanse: vegsystemreferanse,
        srid: '4326',
        alle_versjoner: 'true',
        inkluder: 'alle',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.warn(error);
      return null;
    });
};

export default getFartsgrenseByVegsystemreferanse;
