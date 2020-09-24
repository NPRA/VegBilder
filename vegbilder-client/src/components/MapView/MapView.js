import React from "react";
import { Map, TileLayer, WMSTileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MapView.css";
import SelectedImagePoint from "../SelectedImagePoint/SelectedImagePoint";

const MapView = ({ currentImagePoint, setCurrentImagePoint }) => {
  const renderMap = () => {
    return (
      <Map center={[63.430515, 10.395053]} zoom={12}>
        <TileLayer
          url="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}"
          attribution="<a href='https://www.kartverket.no/'>Kartverket</a>"
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
