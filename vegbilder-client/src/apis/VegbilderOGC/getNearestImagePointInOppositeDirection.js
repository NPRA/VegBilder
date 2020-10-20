import vegbilderOGC from "./vegbilderOGC";
import { createSquareBboxAroundPoint } from "../../utilities/latlngUtilities";
import { isEvenNumber } from "../../utilities/mathUtilities";
import { firstCharOfFeltkodeAsInt } from "../../utilities/vegdataUtilities";
import { findNearestImagePoint } from "../../utilities/imagePointUtilities";

const getNearestImagePointInOppositeDirection = async (
  vegkategori,
  vegnummer,
  kryssdel,
  sideanleggsdel,
  feltkode,
  lat,
  lng
) => {
  if (!vegnummer || !vegnummer || !feltkode || !lat || !lng) {
    return null;
  }

  const bbox = createSquareBboxAroundPoint({ lat, lng }, 50);
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
  };

  const response = await vegbilderOGC.get("", { params: params });
  const imagePoints = response.data.features.filter(
    (ip) =>
      ip.properties.VEGKATEGORI === vegkategori &&
      ip.properties.VEGNUMMER === vegnummer &&
      ip.properties.KRYSSDEL === kryssdel &&
      ip.properties.SIDEANLEGGSDEL === sideanleggsdel &&
      ip.properties.FELTKODE &&
      ip.properties.FELTKODE[0] ===
        firstCharOfFeltkodeOppsiteDirection(feltkode)
  );
  return findNearestImagePoint(imagePoints, { lat, lng });
};

const firstCharOfFeltkodeOppsiteDirection = (feltkode) => {
  if (!feltkode) return null;
  const primaryFeltkode = firstCharOfFeltkodeAsInt(feltkode);
  const numberSignifyingOppositeDirection = isEvenNumber(primaryFeltkode)
    ? 1
    : 2;
  return `${numberSignifyingOppositeDirection}`;
};

export default getNearestImagePointInOppositeDirection;
