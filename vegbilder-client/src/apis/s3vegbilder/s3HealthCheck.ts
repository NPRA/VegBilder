import s3vegbilderApi from './s3vegbilderApi';

const s3HealtCheck = async () => {
  return s3vegbilderApi
    .get('')
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};

export default s3HealtCheck;
