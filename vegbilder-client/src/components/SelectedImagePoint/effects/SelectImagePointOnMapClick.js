import getFeature from "../../../apis/VegbilderOGC/getFeature";
import {
  getDistanceInMetersBetween,
  createSquareBboxAroundPoint,
} from "../../../utilities/latlngUtilities";

const SelectImagePointOnMapClick = (
  map,
  setCurrentImagePoint,
  setClickBbox
) => {
  const onMapClick = async (event) => {
    await selectImagePointNearClick(event, setCurrentImagePoint, setClickBbox);
  };

  map.on("click", onMapClick);
  return () => {
    map.off("click", onMapClick);
  };
};

const selectImagePointNearClick = async (
  event,
  setCurrentImagePoint,
  setClickBbox
) => {
  //console.log(`Clicked on location ${event.latlng}`);
  const clickedPoint = event.latlng;
  const bbox = createSquareBboxAroundPoint(clickedPoint, 30);
  setClickBbox(bbox);
  const featureResponse = await getFeature(bbox);
  //console.log(`Found ${featureResponse.data.totalFeatures} image points near the click point. Selecting the closest one:`);
  const imagePoints = featureResponse.data.features;
  const nearestImagePoint = findNearestImagePoint(imagePoints, clickedPoint);
  setCurrentImagePoint(nearestImagePoint);
  //console.log(nearestImagePoint);
};

const findNearestImagePoint = (imagePoints, clickedPoint) => {
  let nearestPoint = { distance: 100000000, imagePoint: null };
  imagePoints.forEach((ip) => {
    const imageLat = ip.geometry.coordinates[1];
    const imageLng = ip.geometry.coordinates[0];
    const distance = getDistanceInMetersBetween(
      { lat: clickedPoint.lat, lng: clickedPoint.lng },
      { lat: imageLat, lng: imageLng }
    );
    if (distance < nearestPoint.distance) {
      nearestPoint = { distance: distance, imagePoint: ip };
    }
  });
  return nearestPoint.imagePoint;
};

export default SelectImagePointOnMapClick;
