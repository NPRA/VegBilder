import React from 'react';
import { Tooltip, IconButton, makeStyles } from '@material-ui/core';

import { MapIcon, MapDisabledIcon } from 'components/Icons/Icons';
import Theme from 'theme/Theme';

const useStyles = makeStyles(() => ({
  button: {
    backgroundColor: Theme.palette.common.grayDarker,
    opacity: 0.7,
    marginLeft: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: Theme.palette.common.grayRegular,
        },
      },
    },
  },
  buttonDisabled: {
    marginTop: '0.25rem',
    marginLeft: '0.2rem',
    backgroundColor: Theme.palette.common.grayDark,
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
        className={isZoomedInImage ? classes.buttonDisabled : classes.button}
        onClick={() => setMiniMapVisible(!miniMapVisible)}
      >
        {miniMapVisible ? <MapIcon /> : <MapDisabledIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default HideShowMiniMapButton;
