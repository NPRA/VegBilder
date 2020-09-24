import React, { useEffect, useState } from "react";
import { Image } from "semantic-ui-react";

import fetchNearbyImagePointsWhenNecessary from "./effects/fetchNearbyImagePointsWhenNecessary";

const ImageView = ({ currentImagePoint, setCurrentImagePoint }) => {
  const imageUrl =
    currentImagePoint === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImagePoint.properties.URL;

  const [
    nearbyImagePointsOnSameRoadAndLane,
    setNearbyImagePointsOnSameRoadAndLane,
  ] = useState(null);

  useEffect(
    () =>
      fetchNearbyImagePointsWhenNecessary(
        currentImagePoint,
        nearbyImagePointsOnSameRoadAndLane,
        setNearbyImagePointsOnSameRoadAndLane
      ),
    [currentImagePoint]
  );

  return (
    <div>
      <Image src={imageUrl} />
    </div>
  );
};

export default ImageView;
