import React from 'react';
import { AppBar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import ImageControlButtons from './ImageControlButtons';
import { EightySignIcon } from 'components/Icons/Icons';

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
  icon: {
    width: '3rem',
    height: '3rem',
    paddingRight: '1rem',
  },
}));

interface IImageControlBarProps {
  showMessage: (message: string) => void;
  setShowReportErrorsScheme: (value: boolean) => void;
  timeBetweenImages: number;
  setTimeBetweenImages: (newTime: number) => void;
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  meterLineVisible: boolean;
  setMeterLineVisible: (visible: boolean) => void;
  isEnlargedImage: boolean;
}

const ImageControlBar = ({
  showMessage,
  setShowReportErrorsScheme,
  timeBetweenImages,
  setTimeBetweenImages,
  miniMapVisible,
  meterLineVisible,
  setMiniMapVisible,
  setMeterLineVisible,
  isEnlargedImage,
}: IImageControlBarProps) => {
  const classes = useStyles();

  return (
    <AppBar position="relative" className={classes.appbar}>
      <Grid container direction="row" justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item>
          {' '}
          <EightySignIcon className={classes.icon}></EightySignIcon>
        </Grid>
        <Grid item className={classes.imageMetadata}>
          <ImageMetadata />
        </Grid>
        <Grid item>
          <ImageControlButtons
            miniMapVisible={miniMapVisible}
            meterLineVisible={meterLineVisible}
            setMeterLineVisible={setMeterLineVisible}
            setMiniMapVisible={setMiniMapVisible}
            timeBetweenImages={timeBetweenImages}
            setTimeBetweenImages={setTimeBetweenImages}
            showMessage={showMessage}
            setShowReportErrorsScheme={setShowReportErrorsScheme}
            isEnlargedImage={isEnlargedImage}
          />
        </Grid>
        <Grid item className={classes.rightItem} />
      </Grid>
    </AppBar>
  );
};

export default ImageControlBar;
