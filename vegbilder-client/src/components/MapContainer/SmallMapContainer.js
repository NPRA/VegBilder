import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./MapContainer.css";
import { crsUtm33N } from "./crs";
import ImagePointsLayer from "../ImagePointsLayer/ImagePointsLayer";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";

export default function SmallMapContainer() {
  const { currentCoordinates } = useCurrentCoordinates();
  const minZoom = 14;
  const maxZoom = 16;
  console.log("Koordinater:");
  console.log(currentCoordinates);
  return (
    <Map
      center={currentCoordinates.latlng}
      zoom={Math.max(currentCoordinates.zoom, minZoom)}
      crs={crsUtm33N}
      minZoom={minZoom}
      maxZoom={maxZoom}
    >
      <TileLayer
        url="https://m{s}-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
        attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
        subdomains="123456789"
      />
      <ImagePointsLayer allowPopups={false} />
    </Map>
  );
}
