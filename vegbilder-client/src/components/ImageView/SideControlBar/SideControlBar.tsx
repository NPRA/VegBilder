import { makeStyles, Paper, Typography } from '@material-ui/core';
import React from 'react';
import Theme from 'theme/Theme';
import { IImagePoint } from 'types';
import SmallMapContainer from '../SmallMapContainer/SmallMapContainer';
import BackToBigMapButton from './SideControlButtons/BackToBigMapButton';
import HideShowMiniMapButton from './SideControlButtons/HideShowMiniMapButton';
import MoreImageInfoButton from './SideControlButtons/MoreImageInfoButton';

interface ISideControlBarProps {
  setView: (view: string) => void;
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
  imagePoint: IImagePoint | null;
}

const useStyles = makeStyles(() => ({
  sideControlBar: {
    position: 'absolute',
    top: '1rem',
    left: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
  },
  miniMapHeader: {
    display: 'flex',
    marginTop: '0.25rem',
    opacity: 0.8,
    borderStartStartRadius: '10px',
    borderRadius: '10px 10px 0 0',
  },
  miniMapHeaderText: {
    alignSelf: 'center',
    textTransform: 'uppercase',
    opacity: 1,
    color: Theme.palette.common.grayRegular,
  },
}));

const SideControlBar = ({
  setView,
  miniMapVisible,
  setMiniMapVisible,
  isZoomedInImage,
  imagePoint,
}: ISideControlBarProps) => {
  const classes = useStyles();
  return (
    <div className={classes.sideControlBar}>
      <BackToBigMapButton setView={setView} />
      {miniMapVisible && !isZoomedInImage ? (
        <>
          <Paper className={classes.miniMapHeader}>
            <HideShowMiniMapButton
              miniMapVisible={miniMapVisible}
              setMiniMapVisible={setMiniMapVisible}
              isZoomedInImage={isZoomedInImage}
            />
            <Typography variant="subtitle1" className={classes.miniMapHeaderText}>
              {' '}
              Kart{' '}
            </Typography>
          </Paper>
          <SmallMapContainer />
        </>
      ) : (
        <HideShowMiniMapButton
          miniMapVisible={miniMapVisible}
          setMiniMapVisible={setMiniMapVisible}
          isZoomedInImage={isZoomedInImage}
        />
      )}
      {imagePoint ? (
        <MoreImageInfoButton imagePoint={imagePoint} disabled={isZoomedInImage} />
      ) : null}
    </div>
  );
};

export default SideControlBar;
