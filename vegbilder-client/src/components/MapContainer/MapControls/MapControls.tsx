import React from 'react';
import { Box } from '@material-ui/core';

import ZoomControl from './ZoomControl';
import MyLocationControl from './MyLocationControl';
import LayersControl from './LayersControl';

interface IMapControlsProps {
  showMessage: (message: string) => void;
  setMapLayer: (newLayer: string) => void;
  mapLayer: string;
}

const MapControls = ({ showMessage, setMapLayer, mapLayer }: IMapControlsProps) => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      position={'absolute'}
      top={'1rem'}
      right={'1rem'}
      zIndex={10000}
    >
      <MyLocationControl showMessage={showMessage} />
      <LayersControl setMapLayer={setMapLayer} mapLayer={mapLayer} />
      <ZoomControl />
    </Box>
  );
};

export default MapControls;
