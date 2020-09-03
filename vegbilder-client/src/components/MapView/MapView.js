import React from "react";
import { Map, TileLayer } from "react-leaflet";
import { render } from "@testing-library/react";
import "leaflet/dist/leaflet.css";
import "./MapView.css";

const MapView = () => {
  const renderMap = () => {
    return (
      <Map center={[63.430515, 10.395053]} zoom={12}>
        <TileLayer
          url="https://opencache.statkart.no/gatekeeper/gk/gk.open_gmaps?layers=norges_grunnkart&zoom={z}&x={x}&y={y}"
          attribution="<a href='https://www.kartverket.no/'>Kartverket</a>"
        />
      </Map>
    );
  };

  return renderMap();
};

export default MapView;
