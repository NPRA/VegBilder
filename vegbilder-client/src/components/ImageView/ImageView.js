import React, { useEffect, useState } from "react";
import { Image } from "semantic-ui-react";

import getNearbyImagePointsForRoadAndLane from "../../apis/VegbilderOGC/getNearbyImagePointsForRoadAndLane";

const settings = {
  nearbyImagesBboxSizeInMeters: 200,
};

const ImageView = ({ currentImagePoint, setCurrentImagePoint }) => {
  const imageUrl =
    currentImagePoint === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImagePoint.properties.URL;

  const [
    nearbyImagePointsOnSameRoadAndLane,
    setNearbyImagePointsOnSameRoadAndLane,
  ] = useState(null);

  useEffect(() => {
    const fetchNearbyImagePointsOnSameRoadAndLane = async () => {
      const { VEGKATEGORI, VEGNUMMER, FELTKODE } = currentImagePoint.properties;
      const [lng, lat] = currentImagePoint.geometry.coordinates;
      console.log(
        `Fetching images for ${VEGKATEGORI}${VEGNUMMER} - lane ${FELTKODE} near (${lat}, ${lng})`
      );
      const imagePoints = await getNearbyImagePointsForRoadAndLane(
        VEGKATEGORI,
        VEGNUMMER,
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
        isNearEndOfImagePointArray(
          currentImagePoint,
          nearbyImagePointsOnSameRoadAndLane
        ))
    ) {
      fetchNearbyImagePointsOnSameRoadAndLane();
    }
  }, [currentImagePoint]);

  const isNearEndOfImagePointArray = (currentImagePoint, imagePoints) => {
    const currentIndex = imagePoints.findIndex(
      (imagePoint) => imagePoint.id === currentImagePoint.id
    );
    const distanceFromEndOfImagePointArray = Math.min(
      currentIndex,
      nearbyImagePointsOnSameRoadAndLane.length - 1 - currentIndex
    );
    console.log(
      `Current index ${currentIndex} of ${nearbyImagePointsOnSameRoadAndLane.length} loaded imagePoints. Distance from end is ${distanceFromEndOfImagePointArray}`
    );
    return distanceFromEndOfImagePointArray < 3;
  };

  return (
    <div>
      <Image src={imageUrl} />
    </div>
  );
};

export default ImageView;
