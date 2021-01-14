import vegbilderOGC from './vegbilderOGC';

export const getAvailableYearsFromOGC = async () => {
  return await vegbilderOGC
    .get('', {
      params: {
        service: 'WMS',
        version: '2.0.0',
        request: 'Getcapabilities',
        outputformat: 'application/json',
      },
    })
    .then((ogcCapabilities) => {
      const regexp = RegExp(/20\d{2}/);

      let availableYears: number[] = [];
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(ogcCapabilities.data, 'text/xml');

      const titles = xmlDoc.getElementsByTagName('Title');

      for (const item of titles) {
        const yearMatches = item.innerHTML.match(regexp);
        if (yearMatches) {
          const year = parseInt(yearMatches[0]);
          if (!availableYears.includes(year)) {
            availableYears.push(year);
          }
        }
      }
      return availableYears;
    })
    .catch((error) => {
      throw error;
    });
};
