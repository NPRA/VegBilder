import nvdbApi from './nvdbApi';

const GetFartsgrenseByVegsystemreferanse = async (vegsystemreferanse: string) => {
  return await nvdbApi
    .get('/vegobjekter/105', {
      params: {
        vegsystemreferanse: vegsystemreferanse,
        srid: '4326',
        alle_versjoner: 'true',
        inkluder: 'egenskaper',
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.response) {
        // client received an error response (5xx, 4xx)
        console.warn('bad response from nvdb api. ' + error.message);
        return 'Error ' + error;
      } else if (error.request) {
        // client never received a response, or request never left
        console.warn('Didnt receive a response from nvdb ' + error.message);
        return 'Error ' + error;
      } else {
        // anything else
        console.warn('An unknown error occured ' + error.message);
        return 'Error ' + error;
      }
    });
};

export default GetFartsgrenseByVegsystemreferanse;
