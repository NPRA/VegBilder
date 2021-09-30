import React, {useEffect, useRef, useState} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, setHfov} from 'react-pannellum';
import {useRecoilValue, useRecoilState} from 'recoil';
import {currentViewState} from '../../../../recoil/atoms';
import {hfovState, turnedToOtherLaneSelector} from '../../../../recoil/selectors';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const PanoramaImage = ({ imageUrl }) => {

  const [currentView, ] = useRecoilState(currentViewState);
  const [turnToOtherLane, setTurnToOtherLaneSelector] = useRecoilState(turnedToOtherLaneSelector);
  const hfov = useRecoilValue(hfovState);

  const isPreview = currentView === 'map';

  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

  const config = {
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
    doubleClickZoom: true
  };

  const configPreview = {
    ...config,
    doubleClickZoom: false
  }

  const style = {
    objectFit: 'contain',
    margin: '0 auto',
    fontFamily: '"LFT-Etica"',
    color: Theme.palette.common.grayRegular,
  }

  const stylePreview = {
    ...style,
    height: '240px',
    borderRadius: '0 0 10px 10px'
  }

  const useRenderViewer = (imageUrl) => {
    const didMountFirstUrl = useRef(false);

    // Pannellum-biblioteket oppdaterer ikke komponenten automatisk ved ny prop. Må derfor legge til og laste inn nytt bilde som ny scene hver gang.
    useEffect(() => {
      if (didMountFirstUrl.current) {
        let newConfig = {
          ...config,
          pitch: turnToOtherLane ? 0 : getPitch(),
          yaw: turnToOtherLane ? 0 : getYaw(),
          imageSource: imageUrl
        }
        addScene("newScene", newConfig, () => loadScene("newScene"));
        setTurnToOtherLaneSelector(false);

      } else {
        didMountFirstUrl.current = true;
      };
    }, [imageUrl, turnToOtherLane]);
  }

  useEffect(() => {
    setHfov(hfov);
  }, [hfov]);

  useRenderViewer(imageUrl);

  return (
    <>
        <ReactPannellum
        id="1"
        sceneId="initialScene"
        imageSource={imageUrl}
        config={isPreview ? configPreview : config}
        style={isPreview ? stylePreview : style}
        /> 
    </>
  );
};

export default PanoramaImage;
