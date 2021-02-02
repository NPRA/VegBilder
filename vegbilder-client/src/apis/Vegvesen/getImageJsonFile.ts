import axios from 'axios';

const getImageJsonFile = async (url: string) => {
  const urlToFetch = axios.create({
    baseURL: url,
  });

  return await urlToFetch
    .get('', {})
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      if (error.message === 'Request failed with status code 404') {
        console.warn(error);
      }
    });
};

export default getImageJsonFile;
