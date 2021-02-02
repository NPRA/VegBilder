import axios from 'axios';

const getImageJsonFile = async (url: string) => {
  const urlToFetch = axios.create({
    baseURL: url,
  });

  return await urlToFetch
    .get('', {
      headers: { 'Access-Control-Allow-Origin': '*' },
    })
    .then((response) => {
      console.log(response);
      return response;
    })
    .catch((error) => {
      if (error.message === 'Request failed with status code 404') {
        console.warn(error);
      }
    });
};

export default getImageJsonFile;
