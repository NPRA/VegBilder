import React, { useEffect } from 'react';
import { IconButton, makeStyles } from '@material-ui/core';
import LayersRoundedIcon from '@material-ui/icons/LayersRounded';

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

  useEffect(() => {}, []);

  return (
    <>
      <IconButton className={classes.layersControl} onClick={() => setMapLayer('gratone')}>
        <LayersRoundedIcon />
      </IconButton>
    </>
  );
};

export default LayersControl;
