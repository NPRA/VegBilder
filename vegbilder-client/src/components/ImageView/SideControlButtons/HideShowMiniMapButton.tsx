import React from 'react';
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';

import { MapIcon, MapDisabledIcon } from 'components/Icons/Icons';

const useStyles = makeStyles(() => ({
  button: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
    opacity: '30%',
  },
}));

interface IHideShowMiniMapButtonProps {
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
}

const HideShowMiniMapButton = ({
  miniMapVisible,
  setMiniMapVisible,
  isZoomedInImage,
}: IHideShowMiniMapButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={miniMapVisible ? 'Skjul kart' : 'Vis kart'}>
      <IconButton
        disabled={isZoomedInImage}
        aria-label="Vis/skjul kart"
        className={isZoomedInImage ? classes.buttonDisabled : classes.button}
        onClick={() => setMiniMapVisible(!miniMapVisible)}
      >
        {miniMapVisible ? <MapIcon /> : <MapDisabledIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default HideShowMiniMapButton;
