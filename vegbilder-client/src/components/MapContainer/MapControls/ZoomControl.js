import React from 'react';
import { useLeaflet } from 'react-leaflet';
import { IconButton, makeStyles } from '@material-ui/core';
import { AddRounded, RemoveRounded } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  zoomControl: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.common.grayDark,
    borderRadius: '0.625rem',
  },
  zoomInButton: {
    borderBottomLeftRadius: '0',
    borderBottomRightRadius: '0',
  },
  zoomOutButton: {
    borderTopLeftRadius: '0',
    borderTopRightRadius: '0',
  },
  zoomInIcon: {
    borderBottom: `1px ${theme.palette.common.grayIcons} solid`,
  },
  divider: {
    width: '1.5625rem',
    height: '1px',
    backgroundColor: theme.palette.common.grayIcons,
  },
}));

export default function ZoomControl() {
  const classes = useStyles();
  const { map } = useLeaflet();

  function zoomIn() {
    map.zoomIn();
  }

  function zoomOut() {
    map.zoomOut();
  }

  return (
    <div className={classes.zoomControl}>
      <IconButton className={classes.zoomInButton} onClick={zoomIn}>
        <AddRounded id="zoom-in" />
      </IconButton>
      <div className={classes.divider}></div>
      <IconButton className={classes.zoomOutButton} onClick={zoomOut}>
        <RemoveRounded id="zoom-out" />
      </IconButton>
    </div>
  );
}
