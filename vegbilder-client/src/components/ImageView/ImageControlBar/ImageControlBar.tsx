import React, { SetStateAction } from 'react';
import { AppBar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import ImageControlButtons from './ImageControlButtons';

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
    display: 'flex',
    flex: '0 1 20rem',
  },
  rightItem: {
    display: 'relative',
    flex: '0 1 20rem',
  },
  icon: {
    width: '3.5rem',
    height: '3.5rem',
    marginRight: '1rem',
  },
  panoramaToggle: {
    display: 'flex',
    justifyContent: 'flex-end'
  }
}));

interface IImageControlBarProps {
  showMessage: (message: string) => void;
  setShowReportErrorsScheme: (value: boolean) => void;
  timeBetweenImages: number;
  setTimeBetweenImages: (newTime: number) => void;
  meterLineVisible: boolean;
  setMeterLineVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
  setIsZoomedInImage: (isZoomedIn: boolean) => void;
  isHistoryMode: boolean;
  setIsHistoryMode: (isHistoryMode: boolean) => void;
  panoramaIsActive: boolean;
  setPanoramaIsActive: (status: SetStateAction<boolean>) => void;
}

const ImageControlBar = ({
  showMessage,
  setShowReportErrorsScheme,
  timeBetweenImages,
  setTimeBetweenImages,
  meterLineVisible,
  setMeterLineVisible,
  isZoomedInImage,
  setIsZoomedInImage,
  isHistoryMode,
  setIsHistoryMode,
  panoramaIsActive,
  setPanoramaIsActive,
}: IImageControlBarProps) => {
  const classes = useStyles();

  const togglePanoramaView = () => {
    setPanoramaIsActive(!panoramaIsActive);
  };


  return (
    <AppBar position="relative" className={classes.appbar}>
      <Grid container direction="row" justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item className={classes.imageMetadata}>
          <ImageMetadata />
        </Grid>
        <Grid item>
          <ImageControlButtons
            meterLineVisible={meterLineVisible}
            setMeterLineVisible={setMeterLineVisible}
            timeBetweenImages={timeBetweenImages}
            setTimeBetweenImages={setTimeBetweenImages}
            showMessage={showMessage}
            setShowReportErrorsScheme={setShowReportErrorsScheme}
            isZoomedInImage={isZoomedInImage}
            setIsZoomedInImage={setIsZoomedInImage}
            isHistoryMode={isHistoryMode}
            setIsHistoryMode={setIsHistoryMode}
            panoramaIsActive={panoramaIsActive}
          />
        </Grid>
        <Grid item className={classes.rightItem}>
          <div className={classes.panoramaToggle}>
          <button onClick={togglePanoramaView}>Skru på/av 360</button>
          </div>
        </Grid>
      </Grid>
    </AppBar>
  );
};

export default ImageControlBar;
