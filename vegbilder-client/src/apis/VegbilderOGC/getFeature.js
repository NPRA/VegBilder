import vegbilderOGC from "./vegbilderOGC";

const getFeature = async (latlng) => {
  const { lat, lng } = latlng;
  const bbox = {
    west: lng - 0.01,
    south: lat - 0.01,
    east: lng + 0.01,
    north: lat + 0.01,
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
    count: 1,
    srsname: srsname,
    bbox: `${bbox.west},${bbox.south},${bbox.east},${bbox.north},${srsname}`,
    outputformat: "application/json",
  };

  const response = await vegbilderOGC.get("", { params: params });
};

export default getFeature;
