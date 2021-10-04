import wsgeonorge from './wsgeonorge';

export const getStedsnavnByName = async (name: string) => {
  return await wsgeonorge
    .get('stedsnavn/v1/navn', {
      params: {
        sok: `${name}*`,
        treffPerSide: 40,
        utkoordsys: 4326,
      },
    })
    .then((response) => {
      return response;
    })
    .catch((error) => {
      return error;
    });
};
