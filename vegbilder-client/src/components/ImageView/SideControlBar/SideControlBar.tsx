import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { IImagePoint } from 'types';
import SmallMapContainer from './SmallMapContainer/SmallMapContainer';
import BackToBigMapButton from './SideControlButtons/BackToBigMapButton';
import HideShowMiniMapButton from './SideControlButtons/HideShowMiniMapButton';
import ImageInfoButton from '../../ImageInfo/ImageInfoButton';
import ImageInfo from '../../ImageInfo/ImageInfo';

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
    height: '95%',
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
        <ImageInfo
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={isZoomedInImage}
          imagePoint={imagePoint}
          maxHeight={miniMapVisible ? '60%' : '80%'}
        />
      ) : (
        <>
          <br style={{ marginTop: '0.35rem' }} />
          <ImageInfoButton
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
