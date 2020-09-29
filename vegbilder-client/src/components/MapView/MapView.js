import React from "react";
import { Map, TileLayer, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import SelectedImagePoint from "../SelectedImagePoint/SelectedImagePoint";
import { crsUtm33N } from "./crs";

const MapView = ({ currentImagePoint, setCurrentImagePoint }) => {
  const renderMap = () => {
    return (
      <Map
        center={[59.96, 11.05]}
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
        <WMSTileLayer
          url="https://www.vegvesen.no/kart/ogc/vegbilder_1_0/ows"
          attribution="<a href='https://www.vegvesen.no/'>Statens vegvesen</a>"
          layers="Vegbilder_2020"
          format="image/png"
          transparent={true}
        />
        <SelectedImagePoint
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
      </Map>
    );
  };

  return renderMap();
};

export default MapView;
