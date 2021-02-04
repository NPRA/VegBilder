import { ILatlng } from 'types';
import openwps from './openwps';

export const GetElevationByLatLng = async (latlng: ILatlng) => {
  return await openwps
    .get('skwms1/wps.elevation2', {
      params: {
        datainputs: `lat=${latlng.lat};lon=${latlng.lng};espg=4326`,
        request: 'Execute',
        service: 'WPS',
        version: '1.0.0',
        identifier: 'elevation',
      },
    })
    .then((response) => {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, 'text/xml');

      const outputs = xmlDoc.getElementsByTagName('wps:LiteralData');

      for (const item of outputs) {
        const isElevation = item.attributes[0].value === 'float';
        if (isElevation) return item.textContent;
      }
    })
    .catch((error) => {
      throw error;
    });
};
