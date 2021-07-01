import React from 'react';
import { Box } from '@material-ui/core';

import ZoomControl from './ZoomControl';
import MyLocationControl from './MyLocationControl';

interface IMapControlsProps {
  showMessage: (message: string) => void;
}

const MapControls = ({ showMessage }: IMapControlsProps) => {
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
      <ZoomControl />
    </Box>
  );
};

export default MapControls;
