import React, { useEffect, useState, useCallback } from "react";
import { makeStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { useHistory } from "react-router-dom";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { isEvenNumber } from "../../utilities/mathUtilities";
import {
  getImagePointLatLng,
  getImageUrl,
  findNearestImagePoint,
} from "../../utilities/imagePointUtilities";
import { CloseButton } from "../Buttons/Buttons";

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
  const { loadedImagePoints } = useLoadedImagePoints();
  const { command, resetCommand } = useCommand();
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();

  const [nextImagePoint, setNextImagePoint] = useState(null);
  const [previousImagePoint, setPreviousImagePoint] = useState(null);

  const [currentRoadContext, setCurrentRoadContext] = useState(null);
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
    const imagePointsInOppositeLane = loadedImagePoints.imagePoints.filter(
      (ip) =>
        ip.properties.VEGKATEGORI ===
          currentImagePoint.properties.VEGKATEGORI &&
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
    setCurrentCoordinates(latlng);
  }, [
    currentImagePoint,
    loadedImagePoints,
    setCurrentImagePoint,
    setCurrentCoordinates,
  ]);

  const selectNearestImagePointToCurrentCoordinates = useCallback(() => {
    if (!loadedImagePoints || !currentCoordinates) return false;
    const nearestImagePoint = findNearestImagePoint(
      loadedImagePoints.imagePoints,
      currentCoordinates.latlng
    );
    setCurrentImagePoint(nearestImagePoint);
    return true;
  }, [loadedImagePoints, currentCoordinates, setCurrentImagePoint]);

  // Set road context based on current image point
  useEffect(() => {
    if (currentImagePoint) {
      console.log(currentImagePoint.properties);
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
        case commandTypes.selectNearestImagePoint:
          /* Attempt to select the image point nearest to the current coordinates. This is done
           * after a search for vegsystemreferanse in the Search component, but there may
           * also be other uses for it. It is possible that there are no loaded image points,
           * so that no nearest image point can be found. In that case, the command should
           * not be reset, as we want to rerun it on the next render, which may be triggered
           * by loadedImagePoints being populated.
           */
          const wasSuccessful = selectNearestImagePointToCurrentCoordinates();
          resetCommandAfterExecution = wasSuccessful;
          break;
        default:
        // Any other commands do not apply to this component and will be ignored
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
    selectNearestImagePointToCurrentCoordinates,
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
