import vegbilderOGC from "./vegbilderOGC";

const getFeature = async (latlng) => {
  const { lat, lng } = latlng;
  const bbox = {
    west: lng - 0.0002,
    south: lat - 0.0001,
    east: lng + 0.0002,
    north: lat + 0.0001,
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
    count: 10,
    srsname: srsname,
    bbox: `${bbox.south},${bbox.west},${bbox.north},${bbox.east},${srsname}`,
    outputformat: "application/json",
  };

  const response = await vegbilderOGC.get("", { params: params });
  return response;
};

export default getFeature;
