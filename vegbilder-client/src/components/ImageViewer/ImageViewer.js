import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { useHistory } from "react-router-dom";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useFilteredImagePoints } from "../../contexts/FilteredImagePointsContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { isEvenNumber } from "../../utilities/mathUtilities";
import {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
  usesOldVegreferanse,
} from "../../utilities/imagePointUtilities";
import CloseButton from "../CloseButton/CloseButton";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: "100%",
    height: "100%",
    maxHeight: "100%",
    backgroundColor: theme.palette.primary.main,
    display: "flex",
    justifyContent: "center",
  },
  image: {
    maxHeight: "calc(100vh - 9.5rem)",
    maxWidth: "100%",
    objectFit: "contain",
  },
}));

export default function ImageViewer() {
  const classes = useStyles();
  const history = useHistory();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { filteredImagePoints } = useFilteredImagePoints();
  const { command, resetCommand } = useCommand();
  const { setCurrentCoordinates } = useCurrentCoordinates();

  const [nextImagePoint, setNextImagePoint] = useState(null);
  const [previousImagePoint, setPreviousImagePoint] = useState(null);
  const [currentLaneImagePoints, setCurrentLaneImagePoints] = useState([]);

  function firstCharOfFeltkodeOppsiteDirection(feltkode) {
    if (!feltkode) return null;
    const primaryFeltkode = parseInt(feltkode[0], 10);
    const numberSignifyingOppositeDirection = isEvenNumber(primaryFeltkode)
      ? 1
      : 2;
    return `${numberSignifyingOppositeDirection}`;
  }

  const goToNearestImagePointInOppositeLane = useCallback(() => {
    if (!currentImagePoint) return;
    const imagePointsInOppositeLane = filteredImagePoints.filter(
      (ip) =>
        ip.properties.VEGKATEGORI ===
          currentImagePoint.properties.VEGKATEGORI &&
        ip.properties.VEGSTATUS === currentImagePoint.properties.VEGSTATUS &&
        ip.properties.VEGNUMMER === currentImagePoint.properties.VEGNUMMER &&
        ip.properties.STREKNING === currentImagePoint.properties.STREKNING &&
        ip.properties.DELSTREKNING ===
          currentImagePoint.properties.DELSTREKNING &&
        ip.properties.KRYSSDEL === currentImagePoint.properties.KRYSSDEL &&
        ip.properties.SIDEANLEGGSDEL ===
          currentImagePoint.properties.SIDEANLEGGSDEL &&
        ip.properties.ANKERPUNKT === currentImagePoint.properties.ANKERPUNKT &&
        ip.properties.FELTKODE ===
          firstCharOfFeltkodeOppsiteDirection(
            currentImagePoint.properties.FELTKODE
          )
    );
    if (imagePointsInOppositeLane.length === 0) return;
    const nearestImagePointInOppositeLane = findNearestImagePoint(
      imagePointsInOppositeLane,
      getImagePointLatLng(currentImagePoint)
    );
    const latlng = getImagePointLatLng(nearestImagePointInOppositeLane);
    setCurrentImagePoint(nearestImagePointInOppositeLane);
    setCurrentCoordinates({ latlng });
  }, [
    currentImagePoint,
    filteredImagePoints,
    setCurrentImagePoint,
    setCurrentCoordinates,
  ]);

  // Get image points for the current lane in correct order
  useEffect(() => {
    function shouldIncludeImagePoint(imagePoint, currentImagePoint) {
      const currentProps = currentImagePoint.properties;
      const ipProps = imagePoint.properties;
      if (ipProps.VEGKATEGORI !== currentProps.VEGKATEGORI) return false;
      if (ipProps.VEGSTATUS !== currentProps.VEGSTATUS) return false;
      if (ipProps.VEGNUMMER !== currentProps.VEGNUMMER) return false;
      if (ipProps.FELTKODE !== currentProps.FELTKODE) return false;
      if (currentProps.KRYSSDEL || currentProps.SIDEANLEGGSDEL) {
        if (
          currentProps.KRYSSDEL &&
          ipProps.KRYSSDEL !== currentProps.KRYSSDEL
        ) {
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
    }

    function getSortedImagePointsForCurrentLane() {
      const currentLaneImagePoints = filteredImagePoints.filter((ip) =>
        shouldIncludeImagePoint(ip, currentImagePoint)
      );
      const primaryFeltkode = parseInt(
        currentImagePoint.properties.FELTKODE[0],
        10
      );
      const sortOrder = isEvenNumber(primaryFeltkode) ? "desc" : "asc"; // Feltkode is odd in the metering direction and even in the opposite direction
      if (usesOldVegreferanse(currentImagePoint)) {
        return _.orderBy(
          currentLaneImagePoints,
          ["properties.HP", "properties.METER"],
          [sortOrder, sortOrder]
        );
      } else {
        return _.orderBy(
          currentLaneImagePoints,
          [
            "properties.STREKNING",
            "properties.DELSTREKNING",
            "properties.METER",
          ],
          [sortOrder, sortOrder, sortOrder]
        );
      }
    }
    if (filteredImagePoints && currentImagePoint) {
      const sortedImagePointsForCurrentLane = getSortedImagePointsForCurrentLane();
      setCurrentLaneImagePoints(sortedImagePointsForCurrentLane);
    }
  }, [filteredImagePoints, currentImagePoint]);

  // Set next and previous image points
  useEffect(() => {
    function areOnSameOrConsecutiveHovedparsells(imagePoint1, imagePoint2) {
      const hp1 = imagePoint1.properties.HP;
      const hp2 = imagePoint2.properties.HP;
      if (hp1 == null && hp2 == null) return true;
      if (hp1 == null || hp2 == null) return false;
      return Math.abs(hp1 - hp2) <= 1;
    }

    if (
      !currentImagePoint ||
      !currentLaneImagePoints ||
      currentLaneImagePoints.length === 0
    )
      return;

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

    /* Set the next and previous image points, while making sure we do not exceed the bounds
     * of the currentLaneImagePoints array. Also, if we are dealing with image points which
     * use the old vegreferanse (2019 and earlier) we need to beware of large jumps in the
     * hovedparsell number. The main road will have consecutive hovedparsells, while cross
     * parts and such will typically have much larger numbers. When we reach the end of the
     * road, we don't want to make a sudden jump to such a part, which may be some distance
     * away from the current point.
     */

    let nextImagePoint =
      nextIndex < currentLaneImagePoints.length
        ? currentLaneImagePoints[nextIndex]
        : null;
    if (nextImagePoint && usesOldVegreferanse(nextImagePoint)) {
      nextImagePoint = areOnSameOrConsecutiveHovedparsells(
        currentImagePoint,
        nextImagePoint
      )
        ? nextImagePoint
        : null;
    }
    setNextImagePoint(nextImagePoint);

    let previousImagePoint =
      previousIndex >= 0 ? currentLaneImagePoints[previousIndex] : null;
    if (previousImagePoint && usesOldVegreferanse(previousImagePoint)) {
      previousImagePoint = areOnSameOrConsecutiveHovedparsells(
        currentImagePoint,
        previousImagePoint
      )
        ? previousImagePoint
        : null;
    }
    setPreviousImagePoint(previousImagePoint);
  }, [currentImagePoint, currentLaneImagePoints]);

  // Apply command if present
  useEffect(() => {
    if (command) {
      let resetCommandAfterExecution = true;
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
        case commandTypes.turnAround:
          goToNearestImagePointInOppositeLane();
          break;
        default:
          // Any other commands do not apply to this component and will be ignored
          resetCommandAfterExecution = false;
      }
      if (resetCommandAfterExecution) {
        resetCommand();
      }
    }
  }, [
    command,
    resetCommand,
    nextImagePoint,
    previousImagePoint,
    setCurrentCoordinates,
    setCurrentImagePoint,
    goToNearestImagePointInOppositeLane,
  ]);

  return (
    <div className={classes.imageContainer}>
      {currentImagePoint ? (
        <img
          src={getImageUrl(currentImagePoint)}
          alt="vegbilde"
          className={classes.image}
        />
      ) : null}
      <CloseButton onClick={() => history.push("/")} />
    </div>
  );
}
