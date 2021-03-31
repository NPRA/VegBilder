import React, { useEffect, useState } from 'react';
import {
  IconButton,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Typography,
} from '@material-ui/core';
import LayersRoundedIcon from '@material-ui/icons/LayersRounded';
import { MAP_LAYERS } from 'constants/defaultParamters';
import { getBaatTicket } from 'apis/vegkart/getBaatTicket';
import useAsyncError from 'hooks/useAsyncError';

const useStyles = makeStyles(() => ({
  layersControl: {
    marginBottom: '1rem',
  },
  layerOptions: {
    position: 'absolute',
    right: '3rem',
    top: '3.2rem',
  },
}));

interface ILayersControlProps {
  setMapLayer: (newLayer: string) => void;
}

const LayersControl = ({ setMapLayer }: ILayersControlProps) => {
  const classes = useStyles();
  const [showMapLayerOptions, setShowMapLayerOptions] = useState(false);

  const handleChosenMapLayer = (layer: string) => {
    setMapLayer(layer);
    setShowMapLayerOptions(false);
  };

  const handleMoreLayersClick = () => setShowMapLayerOptions(!showMapLayerOptions);

  return (
    <>
      <IconButton
        id="layers-control"
        className={classes.layersControl}
        onClick={handleMoreLayersClick}
      >
        <LayersRoundedIcon id="layers-control" />
      </IconButton>
      {showMapLayerOptions ? (
        <Paper className={classes.layerOptions}>
          <MenuItem id="layers-control" onClick={() => handleChosenMapLayer('gratone')}>
            Gråtonekart
          </MenuItem>
          <MenuItem id="layers-control" onClick={() => handleChosenMapLayer('vegkart')}>
            Vegkart
          </MenuItem>
          <MenuItem id="layers-control" onClick={() => handleChosenMapLayer('flyfoto')}>
            Flyfoto
          </MenuItem>
        </Paper>
      ) : null}
    </>
  );
};

export default LayersControl;
