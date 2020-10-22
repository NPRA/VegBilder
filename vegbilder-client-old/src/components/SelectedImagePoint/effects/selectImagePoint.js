import getImagePointsInBbox from "../../../apis/VegbilderOGC/getImagePointsInBbox";
import { createSquareBboxAroundPoint } from "../../../utilities/latlngUtilities";
import { findNearestImagePoint } from "../../../utilities/imagePointUtilities";

const selectImagePointOnMapClick = (
  map,
  setCurrentImagePoint,
  setClickBbox
) => {
  const onMapClick = async (event) => {
    await selectImagePointNearLocation(
      event.latlng,
      setCurrentImagePoint,
      setClickBbox
    );
  };

  map.on("click", onMapClick);
  return () => {
    map.off("click", onMapClick);
  };
};

const selectImagePointNearLocation = async (
  latlng,
  setCurrentImagePoint,
  setClickBbox
) => {
  const bbox = createSquareBboxAroundPoint(latlng, 30);
  setClickBbox(bbox);
  const featureResponse = await getImagePointsInBbox(bbox);
  const imagePoints = featureResponse.data.features;
  const nearestImagePoint = findNearestImagePoint(imagePoints, latlng);
  setCurrentImagePoint(nearestImagePoint);
};

export { selectImagePointOnMapClick, selectImagePointNearLocation };
