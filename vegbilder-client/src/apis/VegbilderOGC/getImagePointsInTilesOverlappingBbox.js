import _ from "lodash";
import getImagePointsInBbox from "./getImagePointsInBbox";
import {
  roundDownToNearest,
  roundUpToNearest,
} from "../../utilities/mathUtilities";
import { isWithinBbox } from "../../utilities/latlngUtilities";

const settings = {
  bboxSizeInDegrees: 0.02,
  bboxSizeDecimals: 2, // Make sure this equals the number of decimals in bboxSizeInDegrees
};

const getImagePointsInTilesOverlappingBbox = async (bbox) => {
  const { south, west, north, east } = bbox;
  const { bboxSizeInDegrees, bboxSizeDecimals } = settings;
  const expandedBbox = {
    south: roundDownToNearest(south, bboxSizeInDegrees),
    west: roundDownToNearest(west, bboxSizeInDegrees),
    north: roundUpToNearest(north, bboxSizeInDegrees),
    east: roundUpToNearest(east, bboxSizeInDegrees),
  };
  const fetchedBboxes = [];
  for (let i = expandedBbox.west; i < east; i += bboxSizeInDegrees) {
    for (let j = expandedBbox.south; j < north; j += bboxSizeInDegrees) {
      const bbox = {
        south: j.toFixed(bboxSizeDecimals),
        west: i.toFixed(bboxSizeDecimals),
        north: (j + bboxSizeInDegrees).toFixed(bboxSizeDecimals),
        east: (i + bboxSizeInDegrees).toFixed(bboxSizeDecimals),
      };
      fetchedBboxes.push(bbox);
    }
  }
  const promises = fetchedBboxes.map(async (bbox) => {
    return await getImagePointsInBbox(bbox);
  });
  const responses = await Promise.all(promises);
  var imagePoints = _.chain(responses)
    .map((response) => response.data.features)
    .flatten()
    .uniqBy((imagePoint) => imagePoint.id)
    .value();
  return { imagePoints, expandedBbox, fetchedBboxes };
};

export default getImagePointsInTilesOverlappingBbox;
