import getImagePointsInBbox from "./getImagePointsInBbox";
import {
  roundDownToNearest,
  roundUpToNearest,
} from "./../../utilities/mathUtilities";

const settings = {
  bboxSizeInDegrees: 0.02,
  bboxSizeDecimals: 2, // Make sure this equals the number of decimals in bboxSizeInDegrees
};

const getImagePointsInVisibleMapArea = async (mapBbox) => {
  console.log("Map bbox:");
  console.log(mapBbox);
  const { south, west, north, east } = mapBbox;
  const { bboxSizeInDegrees, bboxSizeDecimals } = settings;
  const expandedBoundary = {
    south: roundDownToNearest(south, bboxSizeInDegrees),
    west: roundDownToNearest(west, bboxSizeInDegrees),
    north: roundUpToNearest(north, bboxSizeInDegrees),
    east: roundUpToNearest(east, bboxSizeInDegrees),
  };
  const bboxes = [];
  const imagePointSets = [];
  for (let i = expandedBoundary.west; i < east; i += bboxSizeInDegrees) {
    for (let j = expandedBoundary.south; j < north; j += bboxSizeInDegrees) {
      const bbox = {
        south: j.toFixed(bboxSizeDecimals),
        west: i.toFixed(bboxSizeDecimals),
        north: (j + bboxSizeInDegrees).toFixed(bboxSizeDecimals),
        east: (i + bboxSizeInDegrees).toFixed(bboxSizeDecimals),
      };
      bboxes.push(bbox);
    }
  }
  console.log("Bboxes for fetching:");
  console.log(bboxes);
  for (const bbox of bboxes) {
    const response = await getImagePointsInBbox(bbox);
    const imagePoints = response.data.features;
    imagePointSets.push({ bbox, imagePoints });
  }
  return imagePointSets;
};

export default getImagePointsInVisibleMapArea;
