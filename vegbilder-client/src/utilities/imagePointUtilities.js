import groupBy from 'lodash/groupBy';

import { getDistanceInMetersBetween } from './latlngUtilities';
import { splitDateTimeString } from './dateTimeUtilities';
import { rewriteUrlDomainToLocalhost } from 'local-dev/rewriteurl';

const getImagePointLatLng = (imagePoint) => {
  if (imagePoint) {
    const lat = imagePoint.geometry.coordinates[1];
    const lng = imagePoint.geometry.coordinates[0];
    return { lat, lng };
  }
};

const getImageUrl = (imagepoint) => rewriteUrlDomainToLocalhost(imagepoint.properties.URL);

const findNearestImagePoint = (imagePoints, latlng) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLatlng = getImagePointLatLng(ip);
    const distance = getDistanceInMetersBetween(latlng, imageLatlng);
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

const getRoadReference = (imagePoint) => {
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
  const meterPart = isNaN(METER) ? '' : ` M${Math.round(METER)}`;
  const feltPart = ` F${FELTKODE}`;

  const createVegsystemreferanse = () => {
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
  };

  const createVegreferanse = () => {
    let withoutMeter = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} HP${HP}`;
    let complete = withoutMeter + meterPart + feltPart;
    withoutMeter += feltPart;
    return { complete, withoutMeter };
  };

  return imagePoint.properties.AAR >= 2020 ? createVegsystemreferanse() : createVegreferanse();
};

/* Returns a road reference which should be somewhat applicable across years (compatible with both
 * the old vegreferanse and the new vegsystemreferanse). VEGKATEGORI, VEGSTATUS and VEGNUMMER are
 * usually the same (but they do change occasionally). FELTKODE may also change. Use with care.
 */
const getGenericRoadReference = (imagePoint) => {
  const { VEGKATEGORI, VEGSTATUS, VEGNUMMER, FELTKODE } = imagePoint.properties;
  return `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} F${FELTKODE}`;
};

const usesOldVegreferanse = (imagePoint) => imagePoint.properties.AAR < 2020;

const getDateString = (imagePoint) => splitDateTimeString(imagePoint.properties.TIDSPUNKT)?.date;

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
const groupBySeries = (imagePoints) => {
  const groupedByRoadReference = groupBy(imagePoints, (ip) => getRoadReference(ip).withoutMeter);
  for (const [roadReference, imagePointsForRoadReference] of Object.entries(
    groupedByRoadReference
  )) {
    const groupedByDate = groupBy(imagePointsForRoadReference, getDateString);
    groupedByRoadReference[roadReference] = groupedByDate;
  }
  return groupedByRoadReference;
};

/* Check if two image points are on the same road part or consecutive road parts,
 * where a road part is a:
 *  - hovedparsell (HP) in the old vegreferanse (2019 and earlier)
 *  - combination of strekning and delstrekning in the new vegsystemreferanse (2020 and later)
 */
const areOnSameOrConsecutiveRoadParts = (imagePoint1, imagePoint2) => {
  if (usesOldVegreferanse(imagePoint1) && usesOldVegreferanse(imagePoint2)) {
    return areOnSameOrConsecutiveHovedparsells(imagePoint1, imagePoint2);
  } else if (!usesOldVegreferanse(imagePoint1) && !usesOldVegreferanse(imagePoint2)) {
    return areOnSameOrConsecutiveStrekningDelstrekning(imagePoint1, imagePoint2);
  } else {
    console.error(
      'Tried to compare new vegsystemreferanse with old vegreferanse. This should not happen.'
    );
  }
};

const areOnSameOrConsecutiveHovedparsells = (imagePoint1, imagePoint2) => {
  const hp1 = imagePoint1.properties.HP;
  const hp2 = imagePoint2.properties.HP;
  if (hp1 == null || hp2 == null) {
    console.error(
      `Could not compare hovedparsell for two image points because one or both was null. HP1: ${hp1}, HP2: ${hp2}`
    );
    return false;
  }
  return Math.abs(hp1 - hp2) <= 1;
};

const areOnSameOrConsecutiveStrekningDelstrekning = (imagePoint1, imagePoint2) => {
  const sd1 = {
    strekning: imagePoint1.properties.STREKNING,
    delstrekning: imagePoint1.properties.DELSTREKNING,
  };
  const sd2 = {
    strekning: imagePoint2.properties.STREKNING,
    delstrekning: imagePoint2.properties.DELSTREKNING,
  };
  if (
    sd1.strekning == null ||
    sd1.delstrekning == null ||
    sd2.strekning == null ||
    sd2.delstrekning == null
  ) {
    console.error(
      `Could not compare (strekning, delstrekning) for two image points because one or both was null. SD1: (${sd1.strekning}, ${sd1.delstrekning}), SD2: (${sd2.strekning}, ${sd2.delstrekning})`
    );
    return false;
  }

  const [first, second] =
    sd1.strekning < sd2.strekning ||
    (sd1.strekning === sd2.strekning && sd1.delstrekning < sd2.delstrekning)
      ? [sd1, sd2]
      : [sd2, sd1];

  return (
    // Same strekning and delstrekning
    (second.strekning === first.strekning && second.delstrekning === first.delstrekning) ||
    // Next delstrekning on same strekning
    (second.strekning === first.strekning && second.delstrekning === first.delstrekning + 1) ||
    // First delstrekning on next strekning
    (second.strekning === first.strekning + 1 && second.delstrekning === 1)
  );
};

export {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
  getRoadReference,
  getGenericRoadReference,
  usesOldVegreferanse,
  getDateString,
  groupBySeries,
  areOnSameOrConsecutiveRoadParts,
};
