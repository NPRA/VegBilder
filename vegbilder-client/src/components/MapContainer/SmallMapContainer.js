import React from "react";
import { Map, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { makeStyles } from "@material-ui/core/styles";

import "./MapContainer.css";
import { crsUtm33N } from "./crs";
import ImagePointsLayerSmallMap from "../ImagePointsLayer/ImagePointsLayerSmallMap";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useMiniMap } from "../../contexts/MiniMapContext";

const useStyles = makeStyles({
  minimap: {
    position: "absolute",
    width: "300px",
    height: "300px",
    left: "20px",
    top: "20px",
  },
  minimapHidden: {
    display: "none",
  },
});

export default function SmallMapContainer() {
  const classes = useStyles();
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const { miniMapVisible } = useMiniMap();
  const minZoom = 14;
  const maxZoom = 16;

  return (
    <div className={miniMapVisible ? classes.minimap : classes.minimapHidden}>
      <Map
        center={currentCoordinates.latlng}
        zoom={Math.max(currentCoordinates.zoom, minZoom)}
        crs={crsUtm33N}
        minZoom={minZoom}
        maxZoom={maxZoom}
        onViewportChanged={({ center, zoom }) => {
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
    </div>
  );
}
