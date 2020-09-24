import vegbilderOGC from "./vegbilderOGC";
import {
  createSquareBboxAroundPoint,
  getDistanceInMetersBetween,
} from "../../utilities/latlngUtilities";
import { isEvenNumber } from "../../utilities/mathUtilities";

const getNearestImagePointInOppositeDirection = async (
  roadCategory,
  roadNumber,
  laneCode,
  lat,
  lng
) => {
  const bbox = createSquareBboxAroundPoint({ lat, lng }, 50);
  const srsname = "urn:ogc:def:crs:EPSG::4326";
  const typename = "vegbilder_1_0:Vegbilder_2020";

  const params = {
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typenames: typename,
    typename: typename,
    startindex: 0,
    count: 100,
    srsname: srsname,
    bbox: `${bbox.south},${bbox.west},${bbox.north},${bbox.east},${srsname}`,
    outputformat: "application/json",
  };

  const response = await vegbilderOGC.get("", { params: params });
  const imagePoints = response.data.features.filter(
    (ip) =>
      ip.properties.VEGKATEGORI === roadCategory &&
      ip.properties.VEGNUMMER === roadNumber &&
      ip.properties.FELTKODE === laneCodeOppsiteDirection(laneCode)
  );
  return findNearestImagePoint(imagePoints, { lat, lng });
};

const laneCodeOppsiteDirection = (laneCode) => {
  const laneCodeAsInt = parseInt(laneCode, 10);
  const laneCodeOppositeDirection = isEvenNumber(laneCodeAsInt) ? 1 : 2;
  return `${laneCodeOppositeDirection}`;
};

const findNearestImagePoint = (imagePoints, location) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLat = ip.geometry.coordinates[1];
    const imageLng = ip.geometry.coordinates[0];
    const distance = getDistanceInMetersBetween(location, {
      lat: imageLat,
      lng: imageLng,
    });
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

export default getNearestImagePointInOppositeDirection;
