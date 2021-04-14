import { makeStyles, Paper, Typography } from '@material-ui/core';
import React, { useState } from 'react';
import Theme from 'theme/Theme';
import { IImagePoint } from 'types';
import SmallMapContainer from './SmallMapContainer/SmallMapContainer';
import BackToBigMapButton from './SideControlButtons/BackToBigMapButton';
import HideShowMiniMapButton from './SideControlButtons/HideShowMiniMapButton';
import MoreImageInfoButton from './SideControlButtons/MoreImageInfoButton';
import MoreImageInfo from './MoreImageInfo/MoreImageInfo';

interface ISideControlBarProps {
  setView: (view: string) => void;
  isZoomedInImage: boolean;
  imagePoint: IImagePoint | null;
  isHistoryMode: boolean;
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
    marginTop: '0.35rem',
    backgroundColor: Theme.palette.common.grayDarker,
    opacity: 0.8,
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
  isZoomedInImage,
  imagePoint,
  isHistoryMode,
}: ISideControlBarProps) => {
  const classes = useStyles();

  const [showInformation, setShowInformation] = useState(false);
  const [miniMapVisible, setMiniMapVisible] = useState(true);

  const showMiniMap = (miniMapVisible && !isZoomedInImage) || (isZoomedInImage && isHistoryMode);

  return (
    <div className={classes.sideControlBar}>
      <BackToBigMapButton setView={setView} />
      {showMiniMap ? (
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

      {showInformation && !isZoomedInImage ? (
        <MoreImageInfo
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={isZoomedInImage}
          imagePoint={imagePoint}
        />
      ) : (
        <MoreImageInfoButton
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={isZoomedInImage}
        />
      )}
    </div>
  );
};

export default SideControlBar;
