import React, { useEffect, useState } from "react";
import { Image } from "semantic-ui-react";

import getNearbyImagePointsForRoadAndLane from "../../apis/VegbilderOGC/getNearbyImagePointsForRoadAndLane";

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
        lng
      );
      console.log("Nearby image points on same road and lane:");
      console.log(imagePoints);
      setNearbyImagePointsOnSameRoadAndLane(imagePoints);
    };

    if (currentImagePoint) {
      if (!nearbyImagePointsOnSameRoadAndLane) {
        fetchNearbyImagePointsOnSameRoadAndLane();
      } else {
        const index = nearbyImagePointsOnSameRoadAndLane.findIndex(
          (imagePoint) => imagePoint.id === currentImagePoint.id
        );
        const distanceFromEndOfImagePointArray = Math.min(
          index,
          nearbyImagePointsOnSameRoadAndLane.length - 1 - index
        );
        console.log(
          `Current index ${index} of ${nearbyImagePointsOnSameRoadAndLane.length} loaded imagePoints. Distance from end is ${distanceFromEndOfImagePointArray}`
        );
        if (distanceFromEndOfImagePointArray < 3) {
          fetchNearbyImagePointsOnSameRoadAndLane();
        }
      }
    }
  }, [currentImagePoint]);

  return (
    <div>
      <Image src={imageUrl} />
    </div>
  );
};

export default ImageView;
