import React, { useEffect, useState } from "react";
import { Image, Button } from "semantic-ui-react";

import getNearbyImagePointsForRoadAndLane from "../../apis/VegbilderOGC/getNearbyImagePointsForRoadAndLane";

const ImageView = ({ currentImagePoint, setCurrentImagePoint }) => {
  const imageUrl =
    currentImagePoint === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImagePoint.properties.URL;

  const {
    nearbyImagePointsOnSameRoadAndLane,
    setNearbyImagePointsOnSameRoadAndLane,
  } = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const roadCategory = currentImagePoint.properties.VEGKATEGORI;
      const roadNumber = currentImagePoint.properties.VEGNUMMER;
      const laneCode = currentImagePoint.properties.FELTKODE;
      const [lng, lat] = currentImagePoint.geometry.coordinates;
      console.log(
        `Fetching images for ${roadCategory}${roadNumber} - lane ${laneCode} near (${lat}, ${lng})`
      );
      const imagePointsOnCurrentRoad = await getNearbyImagePointsForRoadAndLane(
        roadCategory,
        roadNumber,
        laneCode,
        lat,
        lng
      );
      console.log(imagePointsOnCurrentRoad);
    };

    if (currentImagePoint) {
      fetchData();
    }
  }, [currentImagePoint]);

  return (
    <div>
      <Image src={imageUrl} />
    </div>
  );
};

export default ImageView;
