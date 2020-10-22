import React, { useEffect } from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import ImagePointLayersWrapper from "../ImagePointLayersWrapper/ImagePointsLayersWrapper";
import { crsUtm33N } from "./crs";

const MapView = ({
  currentLocation,
  currentImagePoint,
  setCurrentImagePoint,
}) => {
  const renderMap = () => {
    return (
      <Map
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={14}
        crs={crsUtm33N}
        minZoom={4}
        maxZoom={16}
      >
        <TileLayer
          url="https://m{s}-nvdbcache.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
          attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
          subdomains="123456789"
        />
        <ImagePointLayersWrapper
          currentLocation={currentLocation}
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
      </Map>
    );
  };

  return renderMap();
};

export default MapView;
