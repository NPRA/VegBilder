import vegbilderOGC from "./vegbilderOGC";

const getNearbyImagePointsForRoadAndLane = async (
  roadCategory,
  roadNumber,
  laneCode,
  lat,
  lng
) => {
  const bbox = {
    west: lng - 0.002,
    south: lat - 0.001,
    east: lng + 0.002,
    north: lat + 0.001,
  };
  const srsname = "urn:ogc:def:crs:EPSG::4326";
  const typename = "vegbilder_1_0:Vegbilder_2020";

  const params = {
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typenames: typename,
    typename: typename,
    startindex: 0,
    count: 100,
    srsname: srsname,
    bbox: `${bbox.south},${bbox.west},${bbox.north},${bbox.east},${srsname}`,
    outputformat: "application/json",
    //CQL_FILTER: `(VEGKATEGORI='${roadCategory}' AND VEGNUMMER='${roadNumber}' AND FELTKODE='${laneCode}')`,
  };

  const response = await vegbilderOGC.get("", { params: params });
  const nearbyImagePointsOnSameRoadAndLane = response.data.features.filter(
    (ip) =>
      ip.properties.VEGKATEGORI === roadCategory &&
      ip.properties.VEGNUMMER === roadNumber &&
      ip.properties.FELTKODE === laneCode &&
      laneCode
  );
  return nearbyImagePointsOnSameRoadAndLane;
};

export default getNearbyImagePointsForRoadAndLane;
