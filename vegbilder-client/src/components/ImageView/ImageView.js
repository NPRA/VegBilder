import React, { useEffect, useState } from "react";
import { Image, Button } from "semantic-ui-react";

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
      const imagePointsOnCurrentRoad = await getNearbyImagePointsForRoadAndLane(
        VEGKATEGORI,
        VEGNUMMER,
        FELTKODE,
        lat,
        lng
      );
      console.log(imagePointsOnCurrentRoad);
    };

    if (currentImagePoint) {
      fetchNearbyImagePointsOnSameRoadAndLane();
    }
  }, [currentImagePoint]);

  return (
    <div>
      <Image src={imageUrl} />
    </div>
  );
};

export default ImageView;
