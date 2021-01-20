import { degreesToRadians } from './mathUtilities';

const metersPerDegreeLat = 111111; // = 10^7 / 90. Approximate value stemming from the original definition of 1 meter as 1/10^7 of the total distance from the equator to the north pole along the meridian running through Paris. It is close enough for our purposes.

const getDistanceInMetersBetween = (pointA, pointB) => {
  const dlat = Math.abs(pointA.lat - pointB.lat);
  const dlng = Math.abs(pointA.lng - pointB.lng);
  const dy = metersPerDegreeLat * dlat;
  const dx = metersPerDegreeLat * Math.cos(degreesToRadians(pointA.lat)) * dlng; // = (The length of a 1 degree arc along the circle of latitude running through pointA) * (the longitudinal angle between the two points). This formula is only valid when the two points are on roughly the same latitude.
  return Math.sqrt(dx * dx + dy * dy);
};

const getBearingBetween = (pointA, pointB) => {
  const lat1 = pointA.lat;
  const lat2 = pointB.lat;
  const dLon = pointB.lng - pointA.lng;
  var y = Math.sin(dLon) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  var brng = Math.atan2(y, x);
  const brngDegress = ((brng * 180) / Math.PI + 360) % 360;
  return brngDegress;
};

const createSquareBboxAroundPoint = (centerPoint, sizeInMeters) => {
  const dLat = dyToDlat(sizeInMeters / 2);
  const dLng = dxToDlng(sizeInMeters / 2, centerPoint.lat);
  const bbox = {
    west: centerPoint.lng - dLng,
    south: centerPoint.lat - dLat,
    east: centerPoint.lng + dLng,
    north: centerPoint.lat + dLat,
  };
  return bbox;
};

const dyToDlat = (dy) => {
  return dy / metersPerDegreeLat;
};

const dxToDlng = (dx, lat) => {
  return dx / (metersPerDegreeLat * Math.cos(degreesToRadians(lat)));
};

const isWithinBbox = (latlng, bbox) => {
  const lat = latlng.lat;
  const lng = latlng.lng;
  return lat >= bbox.south && lat <= bbox.north && lng >= bbox.west && lng <= bbox.east;
};

const isOutsideBbox = (latlng, bbox) => {
  const lat = latlng.lat;
  const lng = latlng.lng;
  return lat < bbox.south || lat > bbox.north || lng < bbox.west || lng > bbox.east;
};

const isBboxWithinContainingBbox = (bbox, containingBbox) => {
  return (
    bbox.south > containingBbox.south &&
    bbox.north < containingBbox.north &&
    bbox.west > containingBbox.west &&
    bbox.east < containingBbox.east
  );
};

export {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
  isWithinBbox,
  isOutsideBbox,
  isBboxWithinContainingBbox,
  getBearingBetween,
};
