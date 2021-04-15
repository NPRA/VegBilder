import nvdbApi from './nvdbApi';

const GetVegObjektByVegsystemreferanseAndVegobjektid = async (
  vegsystemreferanse: string,
  vegobjektid: number
) => {
  return await nvdbApi
    .get(`/vegobjekter/${vegobjektid}`, {
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
      } else if (error.request) {
        // client never received a response, or request never left
        console.warn('Didnt receive a response from nvdb ' + error.message);
      } else {
        // anything else
        console.warn('An unknown error occured ' + error.message);
      }
    });
};

export default GetVegObjektByVegsystemreferanseAndVegobjektid;
