import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./MapContainer.css";
import { crsUtm33N } from "./crs";
import ImagePointLayersWrapper from "../ImagePointsLayersWrapper/ImagePointsLayersWrapper";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";

export default function MapContainer() {
  const { currentCoordinates } = useCurrentCoordinates();
  return (
    <Map
      center={currentCoordinates.latlng}
      zoom={currentCoordinates.zoom}
      crs={crsUtm33N}
      minZoom={4}
      maxZoom={16}
    >
      <TileLayer
        url="https://m{s}-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
        attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
        subdomains="123456789"
      />
      <ImagePointLayersWrapper />
    </Map>
  );
}
