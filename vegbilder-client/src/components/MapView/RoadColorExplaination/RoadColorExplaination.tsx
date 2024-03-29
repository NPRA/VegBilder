import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";

import { currentImagePointState, currentLatLngZoomState } from 'recoil/atoms';

const useStyles = makeStyles(() => ({
  paperContainer: {
    position: 'absolute',
    right: '2rem',
    bottom: '4rem',
    padding: '0.5rem 1rem',
    minWidth: '15rem',
    background: 'rgba(46, 53, 57, 0.80)',
    zIndex: 1,
    display: 'flex',
  },
  colorRoadRow: {
    display: 'flex',
    paddingRight: '1rem',
  },
  markers: {
    margin: '0 0.4rem 0 0',
    transform: 'rotate(40deg)',
  },
}));

const RoadColorExplaination = () => {
  const classes = useStyles();
  const { t } = useTranslation('mapView', {keyPrefix: "legend"});
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const zoomLevel = useRecoilValue(currentLatLngZoomState).zoom;

  const getMarkerIcon = (vegkategori: string) => {
    return `images/markers/marker-${
      vegkategori === 'E' || vegkategori === 'R' ? 'ER' : 'FK'
    }-directional.svg`;
  };

  const shouldShowRoadColorExplaination = currentImagePoint && zoomLevel && zoomLevel > 14;

  return (
    <>
      {shouldShowRoadColorExplaination ? (
        <Paper className={classes.paperContainer}>
          <div className={classes.colorRoadRow}>
            <img
              src={getMarkerIcon('F')}
              alt="Markør for fylkesveger"
              className={classes.markers}
            />
            <Typography variant="body1">{t('green')}</Typography>
          </div>
          <div className={classes.colorRoadRow}>
            <img src={getMarkerIcon('E')} alt="Markør for riksveger" className={classes.markers} />
            <Typography variant="body1">{t('purple')}</Typography>
          </div>
        </Paper>
      ) : null}
    </>
  );
};

export default RoadColorExplaination;
