import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { isEvenNumber } from "../../utilities/mathUtilities";
import { getImagePointLatLng } from "../../utilities/imagePointUtilities";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: "100vw",
    height: "100%",
    backgroundColor: theme.palette.primary.main,
  },
  image: {
    maxHeight: "100%",
    maxWidth: "100%",
  },
}));

export default function ImageViewer() {
  const classes = useStyles();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { loadedImagePoints } = useLoadedImagePoints();
  const { command, resetCommand } = useCommand();
  const { setCurrentCoordinates } = useCurrentCoordinates();

  const [nextImagePoint, setNextImagePoint] = useState(null);
  const [previousImagePoint, setPreviousImagePoint] = useState(null);

  const [currentRoadContext, setCurrentRoadContext] = useState(null);
  const [currentLaneImagePoints, setCurrentLaneImagePoints] = useState([]);

  // Set road context based on current image point
  useEffect(() => {
    if (currentImagePoint) {
      setCurrentRoadContext({
        vegkategori: currentImagePoint.properties.VEGKATEGORI,
        vegnummer: currentImagePoint.properties.VEGNUMMER,
        kryssdel: currentImagePoint.properties.KRYSSDEL,
        sideanleggsdel: currentImagePoint.properties.SIDEANLEGGSDEL,
        feltkode: currentImagePoint.properties.FELTKODE,
        strekning: currentImagePoint.properties.STREKNING,
        delstrekning: currentImagePoint.properties.DELSTREKNING,
        ankerpunkt: currentImagePoint.properties.ANKERPUNKT,
      });
    }
  }, [currentImagePoint]);

  // Get image points for current road context in correct order
  useEffect(() => {
    function getSortedImagePointsForCurrentRoadContext() {
      const currentLaneImagePoints = loadedImagePoints.imagePoints.filter(
        (ip) => {
          let includeImagePoint =
            ip.properties.VEGKATEGORI === currentRoadContext.vegkategori &&
            ip.properties.VEGNUMMER === currentRoadContext.vegnummer &&
            ip.properties.KRYSSDEL === currentRoadContext.kryssdel &&
            ip.properties.SIDEANLEGGSDEL ===
              currentRoadContext.sideanleggsdel &&
            ip.properties.FELTKODE === currentRoadContext.feltkode;
          if (ip.properties.KRYSSDEL || ip.properties.SIDEANLEGGSDEL) {
            return (
              includeImagePoint &&
              ip.properties.KRYSSDEL === currentRoadContext.kryssdel &&
              ip.properties.SIDEANLEGGSDEL ===
                currentRoadContext.sideanleggsdel &&
              ip.properties.ANKERPUNKT === currentRoadContext.ankerpunkt
            );
          } else {
            return includeImagePoint;
          }
        }
      );
      const primaryFeltkode = parseInt(currentRoadContext.feltkode[0], 10);
      const sortOrder = isEvenNumber(primaryFeltkode) ? "desc" : "asc"; // Feltkode is odd in the metering direction and even in the opposite direction
      return _.orderBy(
        currentLaneImagePoints,
        ["properties.STREKNING", "properties.DELSTREKNING", "properties.METER"],
        [sortOrder, sortOrder, sortOrder]
      );
    }
    if (loadedImagePoints && currentRoadContext) {
      const sortedImagePointsForCurrentLane = getSortedImagePointsForCurrentRoadContext();
      setCurrentLaneImagePoints(sortedImagePointsForCurrentLane);
    }
  }, [loadedImagePoints, currentRoadContext]);

  // Set next and previous image points
  useEffect(() => {
    if (currentImagePoint && currentLaneImagePoints) {
      const currentIndex = currentLaneImagePoints.findIndex(
        (ip) => ip.id === currentImagePoint.id
      );
      if (currentIndex === -1) {
        setNextImagePoint(null);
        setPreviousImagePoint(null);
        return;
      }
      const nextIndex = currentIndex + 1;
      const previousIndex = currentIndex - 1;

      if (nextIndex >= currentLaneImagePoints.length) {
        setNextImagePoint(null);
      } else {
        setNextImagePoint(currentLaneImagePoints[nextIndex]);
      }

      if (previousIndex < 0) {
        setPreviousImagePoint(null);
      } else {
        setPreviousImagePoint(currentLaneImagePoints[previousIndex]);
      }
    }
  }, [currentImagePoint, currentLaneImagePoints]);

  // Apply command if present
  useEffect(() => {
    if (command) {
      switch (command) {
        case commandTypes.goForwards:
          if (nextImagePoint) {
            const latlng = getImagePointLatLng(nextImagePoint);
            setCurrentImagePoint(nextImagePoint);
            setCurrentCoordinates({ latlng: latlng });
          }
          break;
        case commandTypes.goBackwards:
          if (previousImagePoint) {
            const latlng = getImagePointLatLng(previousImagePoint);
            setCurrentImagePoint(previousImagePoint);
            setCurrentCoordinates({ latlng: latlng });
          }
          break;
      }
      resetCommand();
    }
  }, [command]);

  return (
    <div className={classes.imageContainer}>
      {currentImagePoint ? (
        <img src={currentImagePoint.properties.URL} className={classes.image} />
      ) : null}
    </div>
  );
}
