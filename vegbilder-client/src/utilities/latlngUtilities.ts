import { IBbox, ILatlng } from 'types';
import { degreesToRadians } from './mathUtilities';

const metersPerDegreeLat = 111111; // = 10^7 / 90. Approximate value stemming from the original definition of 1 meter as 1/10^7 of the total distance from the equator to the north pole along the meridian running through Paris. It is close enough for our purposes.

const getDistanceInMetersBetween = (pointA: ILatlng, pointB: ILatlng) => {
  const dlat = Math.abs(pointA.lat - pointB.lat);
  const dlng = Math.abs(pointA.lng - pointB.lng);
  const dy = metersPerDegreeLat * dlat;
  const dx = metersPerDegreeLat * Math.cos(degreesToRadians(pointA.lat)) * dlng; // = (The length of a 1 degree arc along the circle of latitude running through pointA) * (the longitudinal angle between the two points). This formula is only valid when the two points are on roughly the same latitude.
  return Math.sqrt(dx * dx + dy * dy);
};

const getDistanceFromLatLonInKm = (pointA: ILatlng, pointB: ILatlng) => {
  const earthRadiusInKm = 6371;
  const dLat = deg2rad(pointB.lat - pointA.lat);
  const dLon = deg2rad(pointB.lng - pointA.lng);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(pointA.lat)) *
      Math.cos(deg2rad(pointB.lat)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = earthRadiusInKm * c; // Distance in km
  return distance;
};

const deg2rad = (deg: number) => {
  return deg * (Math.PI / 180);
};

const getBearingBetween = (pointA: ILatlng, pointB: ILatlng) => {
  const φ1 = pointA.lat;
  const λ1 = pointA.lng;
  const φ2 = pointB.lat;
  const λ2 = pointB.lng;
  const y = Math.sin(λ2 - λ1) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(λ2 - λ1);
  const θ = Math.atan2(y, x);
  return ((θ * 180) / Math.PI + 360) % 360; // in degrees
};

const createSquareBboxAroundPoint = (centerPoint: ILatlng, sizeInMeters: number) => {
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

const dyToDlat = (dy: number) => {
  return dy / metersPerDegreeLat;
};

const dxToDlng = (dx: number, lat: number) => {
  return dx / (metersPerDegreeLat * Math.cos(degreesToRadians(lat)));
};

const isWithinBbox = (latlng: ILatlng, bbox: IBbox) => {
  const lat = latlng.lat;
  const lng = latlng.lng;
  return lat >= bbox.south && lat <= bbox.north && lng >= bbox.west && lng <= bbox.east;
};

const isOutsideBbox = (latlng: ILatlng, bbox: IBbox) => {
  const lat = latlng.lat;
  const lng = latlng.lng;
  return lat < bbox.south || lat > bbox.north || lng < bbox.west || lng > bbox.east;
};

const isBboxWithinContainingBbox = (bbox: IBbox, containingBbox: IBbox) => {
  return (
    bbox.south > containingBbox.south &&
    bbox.north < containingBbox.north &&
    bbox.west > containingBbox.west &&
    bbox.east < containingBbox.east
  );
};

const getCoordinatesFromWkt = (wkt: string) => {
  const split = wkt?.split(/[()]/);
  const coordinateString = split[1];
  if (!coordinateString) return null;
  const coordinates = coordinateString.split(' ');
  return {
    lat: parseFloat(coordinates[0]),
    lng: parseFloat(coordinates[1]),
  };
};

export {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
  isWithinBbox,
  isOutsideBbox,
  isBboxWithinContainingBbox,
  getBearingBetween,
  getDistanceFromLatLonInKm,
  getCoordinatesFromWkt,
};
