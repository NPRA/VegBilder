import getImagePointsInBbox from "../../apis/VegbilderOGC/getImagePointsInBbox";
import { createSquareBboxAroundPoint } from "../../utilities/latlngUtilities";
import { findNearestImagePoint } from "../../utilities/imagePointUtilities";

const getNearestImagePoint = async (latlng) => {
  const bbox = createSquareBboxAroundPoint(latlng, 30);
  const response = await getImagePointsInBbox(bbox);
  const imagePoints = response.data.features;
  return findNearestImagePoint(imagePoints, latlng);
};

export default getNearestImagePoint;
