import getImagePointsInBbox from "../../apis/VegbilderOGC/getImagePointsInBbox";
import {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
} from "../../utilities/latlngUtilities";

const getNearestImagePoint = async (latlng) => {
  const bbox = createSquareBboxAroundPoint(latlng, 30);
  const response = await getImagePointsInBbox(bbox);
  const imagePoints = response.data.features;
  return findNearestImagePoint(imagePoints, latlng);
};

const findNearestImagePoint = (imagePoints, latlng) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLat = ip.geometry.coordinates[1];
    const imageLng = ip.geometry.coordinates[0];
    const distance = getDistanceInMetersBetween(
      { lat: latlng.lat, lng: latlng.lng },
      { lat: imageLat, lng: imageLng }
    );
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

export default getNearestImagePoint;
