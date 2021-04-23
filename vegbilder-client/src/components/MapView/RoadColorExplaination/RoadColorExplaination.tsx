import React, { useEffect, useState } from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import { currentImagePointState, currentLatLngZoomState, currentYearState } from 'recoil/atoms';
import { availableYearsQuery } from 'recoil/selectors';

const useStyles = makeStyles(() => ({
  paperContainer: {
    position: 'absolute',
    right: '2rem',
    bottom: '4rem',
    padding: '0.5rem',
    minWidth: '15rem',
    background: 'rgba(46, 53, 57, 0.85)',
    zIndex: 1,
    display: 'flex',
  },
  colorRoadRow: {
    display: 'flex',
    paddingRight: '1rem',
  },
  circle: {
    borderRadius: '50%',
    width: '1rem',
    height: '1rem',
    margin: '0 0.5rem',
    alignSelf: 'center',
  },
}));

const RoadColorExplaination = () => {
  const classes = useStyles();
  const currentYear = useRecoilValue(currentYearState);
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const zoomLevel = useRecoilValue(currentLatLngZoomState).zoom;
  const [colors, setColors] = useState({ fylkesveg: '#49A4A8', riksveg: '#C12D9E' });

  useEffect(() => {
    if (currentYear === availableYears[0]) {
      // nyeste året
      setColors({ fylkesveg: '#49A4A8', riksveg: '#C12D9E' });
    } else {
      setColors({ fylkesveg: '#74D0D4', riksveg: '#DB87CD' }); // eldre
    }
  }, [currentYear]);

  const shouldShowRoadColorExplaination = currentImagePoint && zoomLevel && zoomLevel > 14;

  return (
    <>
      {shouldShowRoadColorExplaination ? (
        <Paper className={classes.paperContainer}>
          <div className={classes.colorRoadRow}>
            <div className={classes.circle} style={{ backgroundColor: colors.fylkesveg }} />
            <Typography variant="body1">Fylkesveger</Typography>
          </div>
          <div className={classes.colorRoadRow}>
            <div className={classes.circle} style={{ backgroundColor: colors.riksveg }} />
            <Typography variant="body1">Riksveger</Typography>
          </div>
        </Paper>
      ) : null}
    </>
  );
};

export default RoadColorExplaination;
