import { getDistanceInMetersBetween } from "./latlngUtilities";

function getImagePointLatLng(imagePoint) {
  const lat = imagePoint.geometry.coordinates[1];
  const lng = imagePoint.geometry.coordinates[0];
  return { lat, lng };
}

function getImageUrl(imagepoint) {
  return imagepoint.properties.URL;
}

function findNearestImagePoint(imagePoints, latlng) {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLatlng = getImagePointLatLng(ip);
    const distance = getDistanceInMetersBetween(latlng, imageLatlng);
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
}

export { getImagePointLatLng, getImageUrl, findNearestImagePoint };
