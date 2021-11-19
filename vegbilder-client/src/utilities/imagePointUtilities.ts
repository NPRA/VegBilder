import groupBy from 'lodash/groupBy';

import { getBearingBetween, getDistanceInMetersBetween } from './latlngUtilities';
import { splitDateTimeString } from './dateTimeUtilities';
import { IImagePoint, IGroupedByDateAndImageType, IGroupedByImageType, ILatlng, ILoadedImagePoints } from 'types';
import { Dictionary } from 'lodash';

const getImagePointLatLng = (imagePoint: IImagePoint) => {
  if (imagePoint) {
    const lat = imagePoint.geometry.coordinates[1];
    const lng = imagePoint.geometry.coordinates[0];
    return { lat, lng };
  }
};

const getImageType = (imagepoint: IImagePoint) => {
  if (!imagepoint.properties.BILDETYPE) {
    return "planar"; 
  } else {
    return imagepoint.properties.BILDETYPE; 
  } 
};

const getImageUrl = (imagepoint: IImagePoint) => imagepoint.properties.URL;

const findNearestImagePoint = (
  imagePoints: IImagePoint[],
  latlng: ILatlng,
  maxDistanceBetweenInMeters = 50
) => {
  let maxDistance = maxDistanceBetweenInMeters;
  let imagePoint_ = imagePoints[0];
  imagePoints.forEach((imagePoint: IImagePoint) => {
    const imageLatlng = getImagePointLatLng(imagePoint);
    if (imageLatlng) {
      const distance = getDistanceInMetersBetween(latlng, imageLatlng);
      if (distance < maxDistance) {
        maxDistance = distance;
        imagePoint_ = imagePoint;
      }
    }
  });
  if (imagePoint_ && maxDistance < maxDistanceBetweenInMeters) {
    return imagePoint_;
  }
};

const getDistanceToBetweenImagePoints = (imagePoint1: IImagePoint, imagePoint2: IImagePoint) => {
  const image1Latlng = getImagePointLatLng(imagePoint1);
  const image2Latlng = getImagePointLatLng(imagePoint2);
  if (image1Latlng && image2Latlng) {
    const distance = getDistanceInMetersBetween(image1Latlng, image2Latlng);
    return distance;
  }
};

const getBearingBetweenImagePoints = (imagePoint1: IImagePoint, imagePoint2: IImagePoint) => {
  const image1Latlng = getImagePointLatLng(imagePoint1);
  const image2Latlng = getImagePointLatLng(imagePoint2);
  if (image1Latlng && image2Latlng) return getBearingBetween(image1Latlng, image2Latlng);
};

const getRoadReference = (imagePoint: IImagePoint) => {
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
    const withoutFelt = withoutMeter + meterPart;
    withoutMeter += feltPart;
    return { complete, withoutMeter, withoutFelt };
  };

  const createVegreferanse = () => {
    let withoutMeter = `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} HP${HP}`;
    const withoutFelt = withoutMeter + meterPart;
    let complete = withoutMeter + meterPart + feltPart;
    withoutMeter += feltPart;
    return { complete, withoutMeter, withoutFelt };
  };

  return imagePoint.properties.AAR >= 2020 ? createVegsystemreferanse() : createVegreferanse();
};

/* Returns a road reference which should be somewhat applicable across years (compatible with both
 * the old vegreferanse and the new vegsystemreferanse). VEGKATEGORI, VEGSTATUS and VEGNUMMER are
 * usually the same (but they do change occasionally). FELTKODE may also change. Use with care.
 */
const getGenericRoadReference = (imagePoint: IImagePoint) => {
  const { VEGKATEGORI, VEGSTATUS, VEGNUMMER, FELTKODE } = imagePoint.properties;
  return `${VEGKATEGORI}${VEGSTATUS}${VEGNUMMER} F${FELTKODE}`;
};

const usesOldVegreferanse = (imagePoint: IImagePoint) => imagePoint.properties.AAR < 2020;

const getDateString = (imagePoint: IImagePoint) =>
  splitDateTimeString(imagePoint.properties.TIDSPUNKT)?.date;

const getFormattedDateString = (imageSeriesDate: string) => {
  const splitted = imageSeriesDate.split('-');
  const day = splitted[2];
  const month = splitted[1];
  const year = splitted[0];
  return `${day}.${month}.${year}`;
};

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
 * new object, under which each key is a date. The value for each date is another dictionary where 
 * the keys are image types and the value is an array with imagepoints.
 */

const groupBySeries = (imagePoints: IImagePoint[]) => {
  let groupedByReferenceDateAndImageType: Dictionary<Dictionary<Dictionary<IImagePoint[]>>> = {};
  const groupedByRoadReference = groupBy(imagePoints, (ip) => getRoadReference(ip).withoutMeter);
  for (const [roadReference, imagePointsForRoadReference] of Object.entries(
    groupedByRoadReference
  )) {
    const groupedByDate = groupBy(imagePointsForRoadReference, getDateString);
    let groupedByDateAndImageType: IGroupedByDateAndImageType = {};
    for (const [date, imagePointsForDate] of Object.entries(groupedByDate)) {
      let groupedByAllAvailableImageTypes: IGroupedByImageType = {};
      const groupedByImageType = groupBy(imagePointsForDate, getImageType);
      groupedByAllAvailableImageTypes = {...groupedByAllAvailableImageTypes, ...groupedByImageType};
      groupedByDateAndImageType[date] = groupedByAllAvailableImageTypes;
    }
    groupedByReferenceDateAndImageType[roadReference] = groupedByDateAndImageType;
  }
  return groupedByReferenceDateAndImageType;
};

/* Check if two image points are on the same road part or consecutive road parts,
 * where a road part is a:
 *  - hovedparsell (HP) in the old vegreferanse (2019 and earlier)
 *  - combination of strekning and delstrekning in the new vegsystemreferanse (2020 and later)
 */
const areOnSameOrConsecutiveRoadParts = (imagePoint1: IImagePoint, imagePoint2: IImagePoint) => {
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

const areOnSameVegkategori = (imagePointA: IImagePoint, imagePointB: IImagePoint) => {
  return imagePointA.properties.VEGKATEGORI === imagePointB.properties.VEGKATEGORI;
};

const areOnSameOrConsecutiveHovedparsells = (
  imagePoint1: IImagePoint,
  imagePoint2: IImagePoint
) => {
  const hp1 = imagePoint1.properties.HP;
  const hp2 = imagePoint2.properties.HP;
  if (hp1 === null || hp2 === null) {
    console.error(
      `Could not compare hovedparsell for two image points because one or both was null. HP1: ${hp1}, HP2: ${hp2}`
    );
    return false;
  }
  return Math.abs(parseInt(hp1) - parseInt(hp2)) <= 1;
};

const areOnSameOrConsecutiveStrekningDelstrekning = (
  imagePoint1: IImagePoint,
  imagePoint2: IImagePoint
) => {
  const sd1 = {
    strekning: imagePoint1.properties.STREKNING,
    delstrekning: imagePoint1.properties.DELSTREKNING,
  };
  const sd2 = {
    strekning: imagePoint2.properties.STREKNING,
    delstrekning: imagePoint2.properties.DELSTREKNING,
  };
  if (
    sd1.strekning === null ||
    sd1.delstrekning === null ||
    sd2.strekning === null ||
    sd2.delstrekning === null
  ) {
    console.error(
      `Could not compare (strekning, delstrekning) for two image points because one or both was null. SD1: (${sd1.strekning}, ${sd1.delstrekning}), SD2: (${sd2.strekning}, ${sd2.delstrekning})`
    );
    return false;
  }

  const [first, second] = [sd1, sd2];

  const areOnSameOrConsecutiveStrekningDelstrekning =
    // Same strekning and delstrekning
    (second.strekning === first.strekning && second.delstrekning === first.delstrekning) ||
    // Next delstrekning on same strekning
    (second.strekning === first.strekning && second.delstrekning === first.delstrekning + 1) ||
    // First delstrekning on next strekning
    (second.strekning === first.strekning + 1 && parseInt(second.delstrekning) === 1);

  return areOnSameOrConsecutiveStrekningDelstrekning;
};

// Get image points for the current lane in correct order
const shouldIncludeImagePoint = (imagePoint: IImagePoint, currentImagePoint: IImagePoint) => {
  const currentProps = currentImagePoint.properties;
  const ipProps = imagePoint.properties;
  if (ipProps.VEGKATEGORI !== currentProps.VEGKATEGORI) return false;
  if (ipProps.VEGSTATUS !== currentProps.VEGSTATUS) return false;
  if (ipProps.VEGNUMMER !== currentProps.VEGNUMMER) return false;
  if (ipProps.FELTKODE !== currentProps.FELTKODE) return false;
  if (currentProps.KRYSSDEL || currentProps.SIDEANLEGGSDEL) {
    if (currentProps.KRYSSDEL && ipProps.KRYSSDEL !== currentProps.KRYSSDEL) {
      return false;
    } else if (
      currentProps.SIDEANLEGGSDEL &&
      ipProps.SIDEANLEGGSDEL !== currentProps.SIDEANLEGGSDEL
    ) {
      return false;
    }
    if (ipProps.ANKERPUNKT !== currentProps.ANKERPUNKT) return false;
    if (ipProps.STREKNING !== currentProps.STREKNING) return false;
    if (ipProps.DELSTREKNING !== currentProps.DELSTREKNING) return false;
  } else {
    if (ipProps.KRYSSDEL || ipProps.SIDEANLEGGSDEL) return false;
  }
  return true;
};

const findLatestImageSeries = (availableImageSeries: IGroupedByDateAndImageType) => {
  let latest = '0001-01-01';
  let imageType = '';
  let latestImageSeries: IImagePoint[] = [];
  for (const dateOfImageSeries of Object.getOwnPropertyNames(availableImageSeries)) {
    for (const imageTypeSeriesOfDate of Object.getOwnPropertyNames(dateOfImageSeries)) {
      if (dateOfImageSeries > latest) {
        latest = dateOfImageSeries;
        imageType = imageTypeSeriesOfDate;
      }
    }
  }
  // If the latest date has a 360 image series, the default is to choose.
   if (Object.getOwnPropertyNames(availableImageSeries[latest]).includes('360')) {
    latestImageSeries = availableImageSeries[latest]['360'];
   } else {
    latestImageSeries = availableImageSeries[latest][imageType];
   }
  return latestImageSeries;
};


// Returns an array used to show markes on the map and used to further filter imagePoints e.g. in either directions.
// The array is a list with all imagePoints that (1) either are on the same road reference and have the same imagetype and 
// datestamp as the selected imagePoint (2) for each road reference that does not correspond to the selected imagePoint's:
// contains the most recent images for that road reference.

const getFilteredImagePoints = (
  loadedImagePoints: ILoadedImagePoints,
  currentImagePoint: IImagePoint
) => {
  if (loadedImagePoints?.imagePointsGroupedBySeries) {
    const currentImageSeries = {
      roadReference: getRoadReference(currentImagePoint).withoutMeter,
      date: getDateString(currentImagePoint),
      imageType: getImageType(currentImagePoint)
    };
    let filteredImagePoints: IImagePoint[] = [];
    for (const [roadReference, availableImageSeriesForRoadReference] of Object.entries(
      loadedImagePoints.imagePointsGroupedBySeries
    )) {
        const imagePointsForRoadReference = roadReference === currentImageSeries?.roadReference
          ? availableImageSeriesForRoadReference[currentImageSeries.date][currentImageSeries.imageType]
          : findLatestImageSeries(availableImageSeriesForRoadReference);
        if (imagePointsForRoadReference) {
          filteredImagePoints = [...filteredImagePoints, ...imagePointsForRoadReference];
        }
    }
    return filteredImagePoints;
  }
  return null;
};

const getImagePointDateObjWithTime = (imagePoint: IImagePoint) => {
  const dateString = imagePoint.properties.TIDSPUNKT; // format: 2020-08-20T09:30:19Z
  return new Date(dateString);
};

const getCurrentImagePointBearing = (
  imagePoints: IImagePoint[],
  currentImagePoint: IImagePoint
) => {
  const currentImagePointDateWithTime = getImagePointDateObjWithTime(currentImagePoint).getTime();

  // find an image point within 30 seconds from currentImagePoint (which is then most likely on the same line)
  const imagePointCloseToCurrent = imagePoints.find(
    (imagePoint) =>
      getImagePointDateObjWithTime(imagePoint).getTime() < currentImagePointDateWithTime + 30000 &&
      getImagePointDateObjWithTime(imagePoint).getTime() > currentImagePointDateWithTime - 30000
  );

  if (imagePointCloseToCurrent) {
    return getBearingBetweenImagePoints(currentImagePoint, imagePointCloseToCurrent);
  }
};

const getImagePointsInSameDirectionOfImagePoint = (imagePoints: IImagePoint[], currentImagePoint: IImagePoint) => {
  const currentImagePointDirection = currentImagePoint.properties.RETNING;
  const maxDistance = 50; // meters (avoid getting a picture on a totally different road)
  const currentImagePointBearing = getCurrentImagePointBearing(
    imagePoints,
    currentImagePoint
  );
  const imagePointsInSameDirection = imagePoints.filter(
    (imagePoint: IImagePoint) => {
      if (imagePoint && currentImagePoint) {
        if (areOnSameVegkategori(currentImagePoint, imagePoint)) {
          const distanceBetween = getDistanceToBetweenImagePoints(
            currentImagePoint,
            imagePoint
          );
          if (typeof(distanceBetween) !== 'undefined' && distanceBetween < maxDistance) {
            const imagePointDirection = imagePoint.properties.RETNING; // this property is more reliable than bearing, so we check this first.
            if (imagePointDirection && currentImagePointDirection) {
              if (imagePointDirection < currentImagePointDirection + 10 &&
                imagePointDirection > currentImagePointDirection - 10)
                return imagePoint;
            } else {
              const bearingBetween = getBearingBetweenImagePoints(
                currentImagePoint,
                imagePoint
              );
              if (
                currentImagePointBearing &&
                bearingBetween &&
                bearingBetween < currentImagePointBearing + 10 &&
                bearingBetween > currentImagePointBearing - 10) 
                {
                return imagePoint;
              }
            }
          }
        }
      }
      return false;
    }
  );
  return imagePointsInSameDirection;
}

const getNearestImagePointInSameDirectionOfImagePoint = (imagePoints: IImagePoint[], imagePoint: IImagePoint) => {
  const imagePointsInSameDirection = getImagePointsInSameDirectionOfImagePoint(imagePoints, imagePoint);
  if (imagePointsInSameDirection.length) {
    const closestImagePointInSameDirection = imagePointsInSameDirection.reduce(
      (prevImgpoint, currImgPoint) => {
        const prevDistance = getDistanceToBetweenImagePoints(imagePoint, prevImgpoint) ?? 10000;
        const currDistance = getDistanceToBetweenImagePoints(imagePoint, currImgPoint) ?? 10000;
        return prevDistance < currDistance ? prevImgpoint : currImgPoint;
      }
    );
    return closestImagePointInSameDirection;
  }
}

export {
  getImagePointLatLng,
  getImageType,
  getImageUrl,
  findNearestImagePoint,
  getRoadReference,
  getGenericRoadReference,
  usesOldVegreferanse,
  getDateString,
  groupBySeries,
  areOnSameOrConsecutiveRoadParts,
  areOnSameVegkategori,
  getFormattedDateString,
  getImagePointDateObjWithTime,
  getDistanceToBetweenImagePoints,
  getBearingBetweenImagePoints,
  shouldIncludeImagePoint,
  getFilteredImagePoints,
  getNearestImagePointInSameDirectionOfImagePoint
};
