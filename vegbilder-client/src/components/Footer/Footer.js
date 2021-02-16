import React from 'react';
import { AppBar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import ControlBar from './ControlBar';

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.main,
    borderTop: `1px solid ${theme.palette.common.grayDark}`,
    width: '100vw',
    height: '100%',
    paddingLeft: '2rem',
    paddingRight: '2rem',
  },
  imageMetadata: {
    flex: '0 1 20rem',
  },
  rightItem: {
    flex: '0 1 20rem',
  },
}));

const Footer = ({ showMessage, setShowReportErrorsScheme }) => {
  const classes = useStyles();

  return (
    <AppBar position="relative" className={classes.appbar}>
      <Grid container direction="row" justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item className={classes.imageMetadata}>
          <ImageMetadata />
        </Grid>
        <Grid item>
          <ControlBar
            showMessage={showMessage}
            setShowReportErrorsScheme={setShowReportErrorsScheme}
          />
        </Grid>
        <Grid item className={classes.rightItem} />
      </Grid>
    </AppBar>
  );
};

export default Footer;
