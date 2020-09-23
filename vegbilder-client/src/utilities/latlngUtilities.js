import { degreesToRadians } from "./mathUtilities";

const metersPerDegreeLat = 111111; // = 10^7 / 90. Approximate value stemming from the original definition of 1 meter as 1/10^7 of the total distance from the equator to the north pole along the meridian running through Paris. It is close enough for our purposes.

const getDistanceInMetersBetween = (pointA, pointB) => {
  const dlat = Math.abs(pointA.lat - pointB.lat);
  const dlng = Math.abs(pointA.lng - pointB.lng);
  const dy = metersPerDegreeLat * dlat;
  const dx = metersPerDegreeLat * Math.cos(degreesToRadians(pointA.lat)) * dlng; // = (The length of a 1 degree arc along the circle of latitude running through pointA) * (the longitudinal angle between the two points). This formula is only valid when the two points are on roughly the same latitude.
  return Math.sqrt(dx * dx + dy * dy);
};

export default getDistanceInMetersBetween;
