import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';

import { crsUtm33N } from '../../../MapContainer/crs';
import ImagePointsLayer from 'components/ImagePointsLayer/ImagePointsLayer';
import './SmallMapContainer.css';
import { useRecoilState } from 'recoil';
import { latLngZoomQueryParameterState } from 'recoil/selectors';
import HideShowMiniMapButton from '../SideControlButtons/HideShowMiniMapButton';

const useStyles = makeStyles(() => ({
  minimap: {
    height: '30%',
    width: '18vw',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    borderRadius: '10px',
    zIndex: 5,
    marginBottom: '0.35rem',
  },
}));

interface ISmallMapContainerProps {
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
}

const SmallMapContainer = ({
  miniMapVisible,
  setMiniMapVisible,
  isZoomedInImage,
}: ISmallMapContainerProps) => {
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const classes = useStyles();
  const minZoom = 13;
  const maxZoom = 16;

  return (
    <div className={classes.minimap}>
      <Map
        center={currentCoordinates}
        zoom={currentCoordinates.zoom}
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
        <HideShowMiniMapButton
          miniMapVisible={miniMapVisible}
          isZoomedInImage={isZoomedInImage}
          setMiniMapVisible={setMiniMapVisible}
        />
      </Map>
    </div>
  );
};

export default SmallMapContainer;
