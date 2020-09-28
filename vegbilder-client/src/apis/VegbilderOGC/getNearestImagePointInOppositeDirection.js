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
  if (!roadNumber || !roadNumber || !laneCode || !lat || !lng) {
    return null;
  }

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
      ip.properties.FELTKODE &&
      ip.properties.FELTKODE[0] ===
        firstCharOfLaneCodeOppsiteDirection(laneCode)
  );
  return findNearestImagePoint(imagePoints, { lat, lng });
};

const firstCharOfLaneCodeOppsiteDirection = (laneCode) => {
  const firstCharOfLaneCodeAsInt = parseInt(laneCode[0], 10);
  const numberSignifyingOppositeDirection = isEvenNumber(
    firstCharOfLaneCodeAsInt
  )
    ? 1
    : 2;
  return `${numberSignifyingOppositeDirection}`;
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
