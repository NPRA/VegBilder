import React, { useEffect, useState } from "react";
import { Image, Button } from "semantic-ui-react";

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

  const [nextImagePoint, setNextImagePoint] = useState(null);
  const [previousImagePoint, setPreviousImagePoint] = useState(null);

  useEffect(() => {
    const setNextAndPreviousImagePoints = () => {
      if (currentImagePoint && nearbyImagePointsOnSameRoadAndLane) {
        const currentIndex = nearbyImagePointsOnSameRoadAndLane.findIndex(
          (ip) => ip.id === currentImagePoint.id
        );
        if (currentIndex === -1) {
          setNextImagePoint(null);
          setPreviousImagePoint(null);
          return;
        }
        const nextIndex = currentIndex + 1;
        const previousIndex = currentIndex - 1;

        if (nextIndex >= nearbyImagePointsOnSameRoadAndLane.length) {
          setNextImagePoint(null);
        } else {
          setNextImagePoint(nearbyImagePointsOnSameRoadAndLane[nextIndex]);
        }

        if (previousIndex < 0) {
          setPreviousImagePoint(null);
        } else {
          setPreviousImagePoint(
            nearbyImagePointsOnSameRoadAndLane[previousIndex]
          );
        }
      }
    };

    fetchNearbyImagePointsWhenNecessary(
      currentImagePoint,
      nearbyImagePointsOnSameRoadAndLane,
      setNearbyImagePointsOnSameRoadAndLane
    );
    setNextAndPreviousImagePoints();
  }, [currentImagePoint, nearbyImagePointsOnSameRoadAndLane]);

  const goToNextImagePoint = () => {
    setCurrentImagePoint(nextImagePoint);
  };

  const goToPreviousImagePoint = () => {
    setCurrentImagePoint(previousImagePoint);
  };

  return (
    <div>
      <Image src={imageUrl} />
      <Button onClick={goToPreviousImagePoint}>Bakover</Button>
      <Button onClick={goToNextImagePoint}>Fremover</Button>
    </div>
  );
};

export default ImageView;
