import _ from "lodash";
import getNearbyImagePointsForRoadAndLane from "../../../apis/VegbilderOGC/getNearbyImagePointsForRoadAndLane";
import { isEvenNumber } from "../../../utilities/mathUtilities";
import { firstCharOfFeltkodeAsInt } from "../../../utilities/vegdataUtilities";

const settings = {
  nearbyImagesBboxSizeInMeters: 1000,
};

const fetchNearbyImagePointsWhenNecessary = (
  currentImagePoint,
  nearbyImagePointsOnSameRoadAndLane,
  setNearbyImagePointsOnSameRoadAndLane
) => {
  const fetchNearbyImagePointsOnSameRoadAndLane = async () => {
    const {
      VEGKATEGORI,
      VEGNUMMER,
      KRYSSDEL,
      SIDEANLEGGSDEL,
      FELTKODE,
    } = currentImagePoint.properties;
    const [lng, lat] = currentImagePoint.geometry.coordinates;
    console.log(
      `Fetching images for ${VEGKATEGORI}${VEGNUMMER} ${
        KRYSSDEL ? "KD" + KRYSSDEL : SIDEANLEGGSDEL ? "SD" + SIDEANLEGGSDEL : ""
      } - lane ${FELTKODE} near (${lat}, ${lng})`
    );
    const imagePoints = await getNearbyImagePointsForRoadAndLane(
      VEGKATEGORI,
      VEGNUMMER,
      KRYSSDEL,
      SIDEANLEGGSDEL,
      FELTKODE,
      lat,
      lng,
      settings.nearbyImagesBboxSizeInMeters
    );

    const imagePointsSorted = sortImagePoints(imagePoints, FELTKODE);

    console.log("Nearby image points on same road and lane:");
    console.log(imagePointsSorted);
    setNearbyImagePointsOnSameRoadAndLane(imagePointsSorted);
  };

  if (
    currentImagePoint &&
    (!nearbyImagePointsOnSameRoadAndLane ||
      isOutsideOrNearEndOfImagePointArray(
        currentImagePoint,
        nearbyImagePointsOnSameRoadAndLane
      ))
  ) {
    fetchNearbyImagePointsOnSameRoadAndLane();
  }
};

const sortImagePoints = (imagePoints, feltkode) => {
  const primaryFeltkode = firstCharOfFeltkodeAsInt(feltkode);
  const order = isEvenNumber(primaryFeltkode) ? "desc" : "asc"; // Feltkode is odd in the metering direction and even in the opposite direction
  return _.orderBy(
    imagePoints,
    ["properties.STREKNING", "properties.DELSTREKNING", "properties.METER"],
    [order, order, order]
  );
};

const isOutsideOrNearEndOfImagePointArray = (
  currentImagePoint,
  imagePoints
) => {
  const currentIndex = imagePoints.findIndex(
    (imagePoint) => imagePoint.id === currentImagePoint.id
  );
  const distanceFromEndOfImagePointArray = Math.min(
    currentIndex,
    imagePoints.length - 1 - currentIndex
  );
  console.log(
    `Current index ${currentIndex} of ${imagePoints.length} loaded imagePoints. Distance from end is ${distanceFromEndOfImagePointArray}`
  );
  return distanceFromEndOfImagePointArray < 3;
};

export default fetchNearbyImagePointsWhenNecessary;
