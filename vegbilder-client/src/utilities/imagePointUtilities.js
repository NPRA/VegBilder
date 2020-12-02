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

function getRoadReference(imagePoint) {
  const {
    VEGKATEGORI,
    VEGSTATUS,
    VEGNUMMER,
    FELTKODE,
    STREKNING,
    DELSTREKNING,
    HP,
    METER,
    KRYSSDEL,
    SIDEANLEGGSDEL,
    ANKERPUNKT,
  } = imagePoint.properties;
  const meterPart = isNaN(METER) ? "" : ` M${Math.round(METER)}`;
  const feltPart = ` F${FELTKODE}`;

  function createVegsystemreferanse() {
    const vegOgStrekning = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} S${STREKNING}D${DELSTREKNING}`;
    let withoutMeter;
    if (KRYSSDEL) {
      withoutMeter = `${vegOgStrekning} M${ANKERPUNKT} KD${KRYSSDEL}`;
    } else if (SIDEANLEGGSDEL) {
      withoutMeter = `${vegOgStrekning} M${ANKERPUNKT} SD${SIDEANLEGGSDEL}`;
    } else {
      withoutMeter = `${vegOgStrekning}`;
    }
    const complete = withoutMeter + meterPart + feltPart;
    withoutMeter += feltPart;
    return { complete, withoutMeter };
  }

  function createVegreferanse() {
    let withoutMeter = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} HP${HP}`;
    let complete = withoutMeter + meterPart + feltPart;
    withoutMeter += feltPart;
    return { complete, withoutMeter };
  }

  return imagePoint.properties.AAR >= 2020
    ? createVegsystemreferanse()
    : createVegreferanse();
}

function getDateString(imagePoint) {
  return splitDateTimeString(imagePoint.properties.TIDSPUNKT)?.date;
}

/* Takes an array of image points and returns those image points grouped first by road reference
 * (vegsystemreferanse or vegreferanse) without the meter value, and then by date. So a
 * series is defined as images taken on one particular day in one particular lane in
 * a limited section of a road.
 *
 * For images from 2020 and later such a section is defined by:
 * strekning, delstrekning and possibly ankerpunkt and kryssdel or sideanleggsdel
 *
 * For images from 2019 and earlier such a section is defined by:
 * hovedparsell
 *
 * The returned object contains a key for each road reference, and the value for each key is a
 * new object, under which each key is a date. The value for each of those is an array of image
 * points.
 */
function groupBySeries(imagePoints) {
  const groupedByRoadReference = _.groupBy(
    imagePoints,
    (ip) => getRoadReference(ip).withoutMeter
  );
  for (const [roadReference, imagePointsForRoadReference] of Object.entries(
    groupedByRoadReference
  )) {
    const groupedByDate = _.groupBy(imagePointsForRoadReference, getDateString);
    groupedByRoadReference[roadReference] = groupedByDate;
  }
  return groupedByRoadReference;
}

export {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
  getRoadReference,
  getDateString,
  groupBySeries,
};
