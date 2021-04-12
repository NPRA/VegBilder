import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';

import { crsUtm33N } from '../../MapContainer/crs';
import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import 'components/MapContainer/MapContainer.css';
import { useRecoilState } from 'recoil';
import { latLngZoomQueryParameterState } from 'recoil/selectors';

const useStyles = makeStyles(() => ({
  minimap: {
    position: 'absolute',
    width: '18vw',
    height: '18vw',
    left: '0.5rem',
    top: '3.4rem',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    borderRadius: '10px',
    zIndex: 5,
  },
  minimapHidden: {
    display: 'none',
  },
  enlargeButton: {
    position: 'absolute',
    zIndex: 1000,
    bottom: 2,
    right: 2,
  },
}));

const SmallMapContainer = () => {
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const classes = useStyles();
  const minZoom = 15;
  const maxZoom = 16;

  return (
    <div className={classes.minimap}>
      <Map
        center={currentCoordinates}
        zoom={Math.max(currentCoordinates.zoom || 4, minZoom)}
        crs={crsUtm33N}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomControl={false}
        onViewportChanged={({ center, zoom }) => {
          if (center && zoom) {
            const latlng = { lat: center[0], lng: center[1] };
            setCurrentCoordinates({ ...latlng, zoom: zoom });
          }
        }}
        attributionControl={false}
      >
        <TileLayer
          url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
          attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
          subdomains="123456789"
        />
        <ImagePointsLayer shouldUseMapBoundsAsTargetBbox={false} />
      </Map>
    </div>
  );
};

export default SmallMapContainer;
