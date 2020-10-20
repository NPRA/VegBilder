import { getDistanceInMetersBetween } from "./latlngUtilities";

const findNearestImagePoint = (imagePoints, latlng) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLatlng = {
      lat: ip.geometry.coordinates[1],
      lng: ip.geometry.coordinates[0],
    };
    const distance = getDistanceInMetersBetween(latlng, imageLatlng);
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

export { findNearestImagePoint };
