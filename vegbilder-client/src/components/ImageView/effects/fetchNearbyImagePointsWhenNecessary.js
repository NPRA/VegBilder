import getNearbyImagePointsForRoadAndLane from "../../../apis/VegbilderOGC/getNearbyImagePointsForRoadAndLane";

const settings = {
  nearbyImagesBboxSizeInMeters: 200,
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
    console.log("Nearby image points on same road and lane:");
    console.log(imagePoints);
    setNearbyImagePointsOnSameRoadAndLane(imagePoints);
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
