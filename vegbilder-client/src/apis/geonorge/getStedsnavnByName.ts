import wsgeonorge from './wsgeonorge';

export const getStedsnavnByName = async (name: string) => {
  return await wsgeonorge
    .get('SKWS3Index/ssr/sok', {
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
      throw error;
    });
};
