import React from 'react';
import { Map, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';

import { crsUtm33N } from 'constants/crs';
import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import './SmallMapContainer.css';
import { useRecoilState } from 'recoil';
import { latLngZoomQueryParameterState } from 'recoil/selectors';
import HideShowMiniMapButton from '../SideControlButtons/HideShowMiniMapButton';

const useStyles = makeStyles(() => ({
  mapAndButtonContainer: {
    height: '30%',
    width: '18vw',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    borderRadius: '10px',
    zIndex: 5,
    marginBottom: '0.35rem',
    pointerEvents: 'all',
  },
  hiddenMap: {
    display: 'none',
  },
  mapContainer: {
    height: '100%',
    width: '100%',
    pointerEvents: 'all',
  },
}));

interface ISmallMapContainerProps {
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
  setView: (view: string) => void;
  isHistoryMode: boolean;
}

const SmallMapContainer = ({
  miniMapVisible,
  setMiniMapVisible,
  isZoomedInImage,
  setView,
  isHistoryMode,
}: ISmallMapContainerProps) => {
  const [currentCoordinates, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const classes = useStyles();
  const minZoom = 13;
  const maxZoom = 16;

  const showMiniMap = (miniMapVisible && !isZoomedInImage) || (isZoomedInImage && isHistoryMode);

  const handleClick = () => {
    setView('map');
  };

  return (
    <div className={showMiniMap ? classes.mapAndButtonContainer : ''}>
      <HideShowMiniMapButton
        miniMapVisible={miniMapVisible}
        isZoomedInImage={isZoomedInImage}
        setMiniMapVisible={setMiniMapVisible}
      />
      <div className={showMiniMap ? classes.mapContainer : classes.hiddenMap}>
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
          onclick={handleClick}
        >
          <TileLayer
            url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
            attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
            subdomains="123456789"
          />
          <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={false} />
        </Map>
      </div>
    </div>
  );
};

export default SmallMapContainer;
