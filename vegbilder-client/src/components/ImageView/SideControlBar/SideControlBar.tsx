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
    width: '18vw',
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
  const showInformationBox =
    (showInformation && !isZoomedInImage) || (isZoomedInImage && isHistoryMode);

  return (
    <div className={classes.sideControlBar}>
      <BackToBigMapButton setView={setView} />
      <>
        <br style={{ marginTop: '0.35rem' }} />
        {showMiniMap ? (
          <SmallMapContainer
            miniMapVisible={miniMapVisible}
            setMiniMapVisible={setMiniMapVisible}
            isZoomedInImage={isZoomedInImage}
          />
        ) : (
          <HideShowMiniMapButton
            miniMapVisible={miniMapVisible}
            setMiniMapVisible={setMiniMapVisible}
            isZoomedInImage={isZoomedInImage}
          />
        )}
      </>
      {showInformationBox ? (
        <MoreImageInfo
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={isZoomedInImage}
          imagePoint={imagePoint}
        />
      ) : (
        <>
          <br style={{ marginTop: '0.35rem' }} />
          <MoreImageInfoButton
            showInformation={showInformation}
            setShowInformation={setShowInformation}
            disabled={isZoomedInImage}
          />
        </>
      )}
    </div>
  );
};

export default SideControlBar;
