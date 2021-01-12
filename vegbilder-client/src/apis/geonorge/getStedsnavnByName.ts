import wsgeonorge from './wsgeonorge';

export const getStedsnavnByName = async (name: string) => {
  return await wsgeonorge
    .get('/sok', {
      params: {
        navn: `${name}*`,
        maxAnt: 10,
        epsgKode: 4326,
        eksakteForst: true,
      },
    })
    .then((response) => {
      const data = response.data;
      if (data.sokStatus.ok) {
        return data;
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
