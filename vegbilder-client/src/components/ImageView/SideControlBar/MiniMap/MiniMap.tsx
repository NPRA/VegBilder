import React from 'react';
import { MapContainer, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { makeStyles } from '@material-ui/core/styles';

import { crsUtm33N } from 'constants/crs';
import ImagePointDirectionalMarkersLayer from 'components/ImagePointDirectionalMarkersLayer/ImagePointDirectionalMarkersLayer';
import './MiniMap.css';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { latLngZoomQueryParameterState } from 'recoil/selectors';
import HideShowMiniMapButton from '../SideControlButtons/HideShowMiniMapButton';
import { ILatlng } from 'types';

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

interface MiniMapProps {
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
  setView: (view: string) => void;
  isHistoryMode: boolean;
}

interface IMiniMapEventHandlerProps {
  setView: (view: string) => void;
}

const ChangeMapView = ({ center, zoom }: { center: ILatlng; zoom: number | undefined }) => {
  const map = useMap();
  if (center && zoom) {
    map.setView(center, zoom);
  }
  return null;
};

const MiniMapEventHandler = ({ setView }: IMiniMapEventHandlerProps) => {
  const setCurrentCoordinates = useSetRecoilState(latLngZoomQueryParameterState);
  const map = useMap();

  useMapEvents({
    click() {
      setView('map');
    },
    zoom() {
      const zoom = map.getZoom();
      const center = map.getCenter();
      setCurrentCoordinates({ ...center, zoom });
    },
    dragend() {
      const zoom = map.getZoom();
      const center = map.getCenter();
      setCurrentCoordinates({ ...center, zoom });
    },
  });
  return null;
};

const MiniMap = ({
  miniMapVisible,
  setMiniMapVisible,
  isZoomedInImage,
  setView,
  isHistoryMode,
}: MiniMapProps) => {
  const currentCoordinates = useRecoilValue(latLngZoomQueryParameterState);
  const classes = useStyles();
  const minZoom = 13;
  const maxZoom = 16;

  const showMiniMap = (miniMapVisible && !isZoomedInImage) || (isZoomedInImage && isHistoryMode);

  return (
    <div className={showMiniMap ? classes.mapAndButtonContainer : ''}>
      <HideShowMiniMapButton
        miniMapVisible={miniMapVisible}
        isZoomedInImage={isZoomedInImage}
        setMiniMapVisible={setMiniMapVisible}
      />
      <div className={showMiniMap ? classes.mapContainer : classes.hiddenMap}>
        <MapContainer
          center={currentCoordinates}
          zoom={currentCoordinates.zoom}
          crs={crsUtm33N}
          minZoom={minZoom}
          maxZoom={maxZoom}
          zoomControl={false}
          attributionControl={false}
        >
          <MiniMapEventHandler setView={setView} />
          <ChangeMapView
            center={{ lat: currentCoordinates.lat, lng: currentCoordinates.lng }}
            zoom={currentCoordinates.zoom ?? 15}
          />
          <TileLayer
            url="https://services.geodataonline.no/arcgis/rest/services/Trafikkportalen/GeocacheTrafikkJPG/MapServer/tile/{z}/{y}/{x}"
            attribution="© NVDB, Geovekst, kommunene og Open Street Map contributors (utenfor Norge)"
            subdomains="123456789"
          />
          <ImagePointDirectionalMarkersLayer shouldUseMapBoundsAsTargetBbox={false} />
        </MapContainer>
      </div>
    </div>
  );
};

export default MiniMap;
