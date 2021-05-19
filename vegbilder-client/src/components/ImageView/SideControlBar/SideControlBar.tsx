import { makeStyles } from '@material-ui/core';
import React, { useState } from 'react';
import { IImagePoint } from 'types';
import SmallMapContainer from './SmallMapContainer/SmallMapContainer';
import BackToBigMapButton from './SideControlButtons/BackToBigMapButton';
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
    pointerEvents: 'none',
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

  const showInformationBox =
    (showInformation && !isZoomedInImage) || (isZoomedInImage && isHistoryMode);

  return (
    <div className={classes.sideControlBar}>
      <BackToBigMapButton setView={setView} isZoomedInImage={isZoomedInImage} />
      <SmallMapContainer
        miniMapVisible={miniMapVisible}
        setMiniMapVisible={setMiniMapVisible}
        isZoomedInImage={isZoomedInImage}
        setView={setView}
        isHistoryMode={isHistoryMode}
      />
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
