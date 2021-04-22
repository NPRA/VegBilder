import React from 'react';
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';

import { MapIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.common.grayDark,
    margin: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.grayRegular,
        },
      },
    },
  },
  active: {
    backgroundColor: theme.palette.common.grayDark,
    margin: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.orangeDark,
        },
      },
    },
  },
  buttonDisabled: {
    margin: '0.2rem',
    backgroundColor: theme.palette.common.grayDark,
    opacity: 0.7,
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
        className={
          isZoomedInImage
            ? classes.buttonDisabled
            : miniMapVisible
            ? classes.active
            : classes.button
        }
        style={miniMapVisible && !isZoomedInImage ? { position: 'absolute', zIndex: 1000 } : {}}
        onClick={() => setMiniMapVisible(!miniMapVisible)}
      >
        <MapIcon />
      </IconButton>
    </Tooltip>
  );
};

export default HideShowMiniMapButton;
