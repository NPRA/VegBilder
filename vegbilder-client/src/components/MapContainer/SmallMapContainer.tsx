import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';

import { crsUtm33N } from './crs';
import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useToggles } from 'contexts/TogglesContext';
import './MapContainer.css';
import { IconButton, Tooltip } from '@material-ui/core';
import { EnlargeIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  minimap: {
    position: 'absolute',
    width: '18vw',
    height: '18vw',
    left: '1.25rem',
    top: '1.25rem',
    border: `1px ${theme.palette.primary.main} solid`,
    boxShadow: '1px 2px 2px 2px rgba(0, 0, 0, 0.4)',
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

interface ISmallMapContainerProps {
  exitImageView: () => void;
}

const SmallMapContainer = ({ exitImageView }: ISmallMapContainerProps) => {
  const { currentCoordinates, setCurrentCoordinates } = useCurrentCoordinates();
  const { miniMapVisible } = useToggles();
  const classes = useStyles();
  const minZoom = 15;
  const maxZoom = 16;

  return (
    <div className={miniMapVisible ? classes.minimap : classes.minimapHidden}>
      <Map
        center={currentCoordinates.latlng}
        zoom={Math.max(currentCoordinates.zoom, minZoom)}
        crs={crsUtm33N}
        minZoom={minZoom}
        maxZoom={maxZoom}
        zoomControl={false}
        onViewportChanged={({ center, zoom }) => {
          if (center && zoom) {
            const latlng = { lat: center[0], lng: center[1] };
            setCurrentCoordinates({ latlng, zoom });
          }
        }}
        attributionControl={false}
      >
        <Tooltip title="Åpne kart">
          <IconButton className={classes.enlargeButton} onClick={exitImageView}>
            <EnlargeIcon />
          </IconButton>
        </Tooltip>
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
