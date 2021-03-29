import vegkart from './vegkart';

export const getBaatTicket = async () => {
  return await vegkart
    .get('', {})
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};
