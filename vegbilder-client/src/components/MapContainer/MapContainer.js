import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./MapContainer.css";
import { crsUtm33N } from "./crs";
import ImagePointLayersWrapper from "../ImagePointsLayersWrapper/ImagePointsLayersWrapper";
import CurrentLocationContext from "../../contexts/CurrentLocationContext";

function renderMap(currentLocation) {
  return (
    <Map
      center={currentLocation}
      zoom={4}
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

export default function MapContainer() {
  return (
    <CurrentLocationContext.Consumer>
      {({ currentLocation }) => renderMap(currentLocation)}
    </CurrentLocationContext.Consumer>
  );
}
