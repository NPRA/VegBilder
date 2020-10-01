import vegbilderOGC from "./vegbilderOGC";
import { createSquareBboxAroundPoint } from "../../utilities/latlngUtilities";

const getNearbyImagePointsForRoadAndLane = async (
  vegkategori,
  vegnummer,
  kryssdel,
  sideanleggsdel,
  feltkode,
  lat,
  lng,
  bboxSizeInMeters
) => {
  const bbox = createSquareBboxAroundPoint({ lat, lng }, bboxSizeInMeters);
  const srsname = "urn:ogc:def:crs:EPSG::4326";
  const typename = "vegbilder_1_0:Vegbilder_2020";

  const params = {
    service: "WFS",
    version: "2.0.0",
    request: "GetFeature",
    typenames: typename,
    typename: typename,
    startindex: 0,
    count: 10000,
    srsname: srsname,
    bbox: `${bbox.south},${bbox.west},${bbox.north},${bbox.east},${srsname}`,
    outputformat: "application/json",
    //CQL_FILTER: `(VEGKATEGORI='${vegkategori}' AND VEGNUMMER='${vegnummer}' AND KRYSSDEL='${kryssdel} AND SIDEANLEGGSDEL='${sideanleggsdel}'' AND FELTKODE='${feltkode}')`,
  };

  const response = await vegbilderOGC.get("", { params: params });
  const imagePoints = response.data.features.filter(
    (ip) =>
      ip.properties.VEGKATEGORI === vegkategori &&
      ip.properties.VEGNUMMER === vegnummer &&
      ip.properties.KRYSSDEL === kryssdel &&
      ip.properties.SIDEANLEGGSDEL === sideanleggsdel &&
      ip.properties.FELTKODE === feltkode
  );
  return imagePoints;
};

export default getNearbyImagePointsForRoadAndLane;
