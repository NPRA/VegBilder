import { chain } from 'lodash';
import getImagePointsInBbox from './getImagePointsInBbox';
import { roundDownToNearest, roundUpToNearest } from 'utilities/mathUtilities';
import { IBbox } from 'types';

const settings = {
  bboxSizeInDegrees: 0.01, // ~1100 m
  bboxSizeDecimals: 2, // Make sure this equals the number of decimals in bboxSizeInDegrees
};

const getImagePointsInTilesOverlappingBbox = async (bbox: IBbox, year: number) => {
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
        south: Number(j.toFixed(bboxSizeDecimals)),
        west: Number(i.toFixed(bboxSizeDecimals)),
        north: Number((j + bboxSizeInDegrees).toFixed(bboxSizeDecimals)),
        east: Number((i + bboxSizeInDegrees).toFixed(bboxSizeDecimals)),
      };
      fetchedBboxes.push(bbox);
    }
  }

  const promises = fetchedBboxes.map(async (bbox) => {
    return await getImagePointsInBbox(bbox, year);
  });

  const responses = await Promise.all(promises);

  const imagePoints = chain(responses)
    .map((response) => response.data.features)
    .flatten()
    .uniqBy((imagePoint) => imagePoint.id)
    .value();
  return { imagePoints, expandedBbox, fetchedBboxes };
};

export default getImagePointsInTilesOverlappingBbox;
