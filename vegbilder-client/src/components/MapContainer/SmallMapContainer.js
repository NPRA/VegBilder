import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import "./MapContainer.css";
import { crsUtm33N } from "./crs";
import ImagePointsLayerSmallMap from "../ImagePointsLayer/ImagePointsLayerSmallMap";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";

export default function SmallMapContainer() {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const minZoom = 14;
  const maxZoom = 16;

  console.log(
    `Current coordinates: { lat: ${currentCoordinates.latlng.lat}, lng: ${currentCoordinates.latlng.lat}, zoom: ${currentCoordinates.zoom} }`
  );

  return (
    <Map
      center={currentCoordinates.latlng}
      zoom={Math.max(currentCoordinates.zoom, minZoom)}
      crs={crsUtm33N}
      minZoom={minZoom}
      maxZoom={maxZoom}
      onViewportChanged={({ center, zoom }) => {
        console.log("Viewport changed");
        const latlng = { lat: center[0], lng: center[1] };
        setCurrentCoordinates({ latlng, zoom });
      }}
    >
      <TileLayer
        url="https://m{s}-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
        attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
        subdomains="123456789"
      />
      <ImagePointsLayerSmallMap />
    </Map>
  );
}
