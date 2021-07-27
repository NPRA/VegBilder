import { IBbox } from 'types';
import vegbilderOGC from './vegbilderOGC';

const getImagePointsInBbox = async (bbox: IBbox, typename: string) => {
  const srsname = 'urn:ogc:def:crs:EPSG::4326';

  const params = {
    service: 'WFS',
    version: '2.0.0',
    request: 'GetFeature',
    typenames: typename,
    startindex: 0,
    count: 10000,
    srsname: srsname,
    bbox: `${bbox.south},${bbox.west},${bbox.north},${bbox.east},${srsname}`,
    outputformat: 'application/json',
  };

  const response = await vegbilderOGC.get('', { params: params });
  return response;
};

export default getImagePointsInBbox;
