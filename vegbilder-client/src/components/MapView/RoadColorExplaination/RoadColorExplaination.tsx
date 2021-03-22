import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paperContainer: {
    position: 'absolute',
    left: '2rem',
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
    backgroundColor: 'pink',
    margin: '0 0.5rem',
    alignSelf: 'center',
  },
}));

const RoadColorExplaination = () => {
  const classes = useStyles();
  return (
    <Paper className={classes.paperContainer}>
      <div className={classes.colorRoadRow}>
        <div className={classes.circle} />
        <Typography variant="body1">Fylkesveger</Typography>
      </div>
      <div className={classes.colorRoadRow}>
        <div className={classes.circle} />
        <Typography variant="body1">Riksveger</Typography>
      </div>
    </Paper>
  );
};

export default RoadColorExplaination;
