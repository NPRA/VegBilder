import React, { useEffect, useState } from 'react';
import { AppBar, Grid } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import ImageControlButtons from './ImageControlButtons';
import {
  EightySignIcon,
  FiftySignIcon,
  FourtySignIcon,
  HundredSignIcon,
  HundredTenSignIcon,
  NighntySignIcon,
  SeventySignIcon,
  SixtySignIcon,
  ThirthySignIcon,
} from 'components/Icons/Icons';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import getFartsgrenseByVegsystemreferanse from 'apis/NVDB/getFartsgrenseByVegsystemreferanse';
import { getRoadReference } from 'utilities/imagePointUtilities';

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
    flex: '0 1 20rem',
  },
  icon: {
    width: '3.5rem',
    height: '3.5rem',
    marginRight: '1rem',
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

  const { currentImagePoint } = useCurrentImagePoint();
  const [fartsgrense, setFartsgrense] = useState(0);

  const getFartsgrense = async () => {
    const vegsystemreferanse = getRoadReference(currentImagePoint)
      .withoutFelt.replace(/\s/g, '')
      .toLocaleLowerCase();
    await getFartsgrenseByVegsystemreferanse(vegsystemreferanse).then((res) => {
      if (res) {
        const egenskaper = res.objekter[0].egenskaper;
        const fartsgrense = egenskaper.find((egenskap: any) => egenskap.navn === 'Fartsgrense');
        setFartsgrense(fartsgrense.verdi);
      }
    });
  };

  const getFartsgrenseIcon = (fartsgrense: number) => {
    switch (fartsgrense) {
      case 30:
        return <ThirthySignIcon className={classes.icon} />;
      case 40:
        return <FourtySignIcon className={classes.icon} />;
      case 50:
        return <FiftySignIcon className={classes.icon} />;
      case 60:
        return <SixtySignIcon className={classes.icon} />;
      case 70:
        return <SeventySignIcon className={classes.icon} />;
      case 80:
        return <EightySignIcon className={classes.icon} />;
      case 90:
        return <NighntySignIcon className={classes.icon} />;
      case 100:
        return <HundredSignIcon className={classes.icon} />;
      case 110:
        return <HundredTenSignIcon className={classes.icon} />;
      default:
        return null;
    }
  };

  useEffect(() => {
    if (currentImagePoint) {
      getFartsgrense();
    }
  }, [currentImagePoint]);

  return (
    <AppBar position="relative" className={classes.appbar}>
      <Grid container direction="row" justify="space-between" alignItems="center" wrap="nowrap">
        <Grid item className={classes.imageMetadata}>
          {getFartsgrenseIcon(fartsgrense)}
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
