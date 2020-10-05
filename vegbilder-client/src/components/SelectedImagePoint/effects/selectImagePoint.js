import getImagePointsInBbox from "../../../apis/VegbilderOGC/getImagePointsInBbox";
import {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
} from "../../../utilities/latlngUtilities";

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

const findNearestImagePoint = (imagePoints, latlng) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLat = ip.geometry.coordinates[1];
    const imageLng = ip.geometry.coordinates[0];
    const distance = getDistanceInMetersBetween(
      { lat: latlng.lat, lng: latlng.lng },
      { lat: imageLat, lng: imageLng }
    );
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

export { selectImagePointOnMapClick, selectImagePointNearLocation };
