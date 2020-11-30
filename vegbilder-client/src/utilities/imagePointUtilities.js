import _ from "lodash";

import { getDistanceInMetersBetween } from "./latlngUtilities";
import { splitDateTimeString } from "./dateTimeUtilities";

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

function getRoadContextString(imagePoint) {
  let roadContext = `${imagePoint.properties.VEGKATEGORI}${imagePoint.properties.VEGSTATUS}${imagePoint.properties.VEGNUMMER}_S${imagePoint.properties.STREKNING}D${imagePoint.properties.DELSTREKNING}`;
  if (imagePoint.properties.KRYSSDEL) {
    roadContext += `_KD${imagePoint.properties.KRYSSDEL}`;
  }
  if (imagePoint.properties.SIDEANLEGGSDEL) {
    roadContext += `_SD${imagePoint.properties.SIDEANLEGGSDEL}`;
  }
  roadContext += `_F${imagePoint.properties.FELTKODE}`;
  return roadContext;
}

function getDateString(imagePoint) {
  return splitDateTimeString(imagePoint.properties.TIDSPUNKT)?.date;
}

function groupBySeries(imagePoints) {
  const groupedByRoadContext = _.groupBy(imagePoints, getRoadContextString);
  for (const [roadContext, imagePointsForRoadContext] of Object.entries(
    groupedByRoadContext
  )) {
    const groupedByDate = _.groupBy(imagePointsForRoadContext, getDateString);
    groupedByRoadContext[roadContext] = groupedByDate;
  }
  return groupedByRoadContext;
}

export {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
  getRoadContextString,
  getDateString,
  groupBySeries,
};
