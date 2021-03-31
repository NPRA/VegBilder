import React, { useState } from 'react';
import {
  IconButton,
  ListItemIcon,
  ListItemText,
  makeStyles,
  MenuItem,
  Paper,
} from '@material-ui/core';
import LayersRoundedIcon from '@material-ui/icons/LayersRounded';
import { Map, Satellite, Terrain } from '@material-ui/icons';
import Theme from 'theme/Theme';

const useStyles = makeStyles(() => ({
  layersControl: {
    marginBottom: '1rem',
  },
  layerOptions: {
    position: 'absolute',
    right: '3rem',
    top: '3.2rem',
    backgroundColor: Theme.palette.common.grayDarker,
  },
}));

interface ILayersControlProps {
  setMapLayer: (newLayer: string) => void;
  mapLayer: string;
}

const LayersControl = ({ setMapLayer, mapLayer }: ILayersControlProps) => {
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
          <MenuItem
            id="layers-control"
            onClick={() => handleChosenMapLayer('gratone')}
            selected={mapLayer === 'gratone'}
          >
            <ListItemIcon>
              <Terrain />
            </ListItemIcon>
            <ListItemText primary="Gråtonekart" />
          </MenuItem>
          <MenuItem
            id="layers-control"
            onClick={() => handleChosenMapLayer('vegkart')}
            selected={mapLayer === 'vegkart'}
          >
            <ListItemIcon>
              <Map />
            </ListItemIcon>
            <ListItemText primary="Vegkart" />
          </MenuItem>
          <MenuItem
            id="layers-control"
            onClick={() => handleChosenMapLayer('flyfoto')}
            selected={mapLayer === 'flyfoto'}
          >
            <ListItemIcon>
              <Satellite />
            </ListItemIcon>
            <ListItemText primary="Flyfoto" />
          </MenuItem>
        </Paper>
      ) : null}
    </>
  );
};

export default LayersControl;
