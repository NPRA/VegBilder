import React, { useEffect, useState } from 'react';
import { IconButton, ListItemText, makeStyles, Menu, MenuItem } from '@material-ui/core';
import LayersRoundedIcon from '@material-ui/icons/LayersRounded';
import { MAP_LAYERS } from 'constants/defaultParamters';
import { getBaatTicket } from 'apis/vegkart/getBaatTicket';
import useAsyncError from 'hooks/useAsyncError';

const useStyles = makeStyles(() => ({
  layersControl: {
    marginBottom: '1rem',
  },
}));

interface ILayersControlProps {
  setMapLayer: (newLayer: string) => void;
}

const LayersControl = ({ setMapLayer }: ILayersControlProps) => {
  const classes = useStyles();
  const [mapLayerOptionsAnchorEl, setMapLayerOptionsAnchorEl] = useState<Element | null>(null);

  const handleMapLayerOptionsClose = () => setMapLayerOptionsAnchorEl(null);

  const handleMoreLayersClick = (event: any) => setMapLayerOptionsAnchorEl(event.currentTarget);

  return (
    <>
      <IconButton className={classes.layersControl} onClick={handleMoreLayersClick}>
        <LayersRoundedIcon id="layers-control" />
      </IconButton>
      <Menu
        id="Map-layer-options"
        anchorEl={mapLayerOptionsAnchorEl}
        keepMounted
        open={Boolean(mapLayerOptionsAnchorEl)}
        onClose={handleMapLayerOptionsClose}
        anchorOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'center',
          horizontal: 'center',
        }}
      >
        {MAP_LAYERS.map((layer) => (
          <MenuItem
            key={layer}
            onClick={() => {
              setMapLayer(layer);
              handleMapLayerOptionsClose();
            }}
            //className={classes.speedMenuItem}
          >
            {/* {option === timeBetweenImages && <CheckmarkIcon className={classes.iconStyle} />} */}
            <ListItemText
              primary={layer}
              // style={{
              //   color: option === timeBetweenImages ? Theme.palette.common.orangeDark : '',
              // }}
            />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

export default LayersControl;
