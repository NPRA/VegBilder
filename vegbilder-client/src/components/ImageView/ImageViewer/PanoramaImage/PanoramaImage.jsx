import React, {useEffect, useRef} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, getHfov} from 'react-pannellum';
import {useRecoilState} from 'recoil';
import {currentViewState, currentHfovState} from '../../../../recoil/atoms';
import { turnedToOtherLaneSelector } from '../../../../recoil/selectors';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const PanoramaImage = ({ imageUrl }) => {

  const [currentView, ] = useRecoilState(currentViewState);
  const [turnToOtherLane, setTurnToOtherLaneSelector] = useRecoilState(turnedToOtherLaneSelector);
  const [, setCurrentHfovRecoil] = useRecoilState(currentHfovState);

  const isPreview = currentView === 'map';

  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

  const updateZoomRecoilState = () => {
    setCurrentHfovRecoil(getHfov());
  }

  const config = {
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
    doubleClickZoom: true,
    displayAboutInformation: false,
    displayLoadingSpinner: false,
    onScrollZoom: updateZoomRecoilState
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

    // Pannellum-biblioteket oppdaterer ikke komponenten automatisk ved ny prop.
    // Må derfor legge til og laste inn nytt bilde som ny scene hver gang (unntatt første scene, derav useRef).
  const useRenderPannellumViewer = (imageUrl) => {
    const didMountFirstUrl = useRef(false);

    useEffect(() => {
      if (didMountFirstUrl.current) {
        let newConfig = {
          ...config,
          pitch: turnToOtherLane ? 0 : getPitch(),
          yaw: turnToOtherLane ? 0 : getYaw(),
          hfov: turnToOtherLane ? 100 : getHfov(),
          imageSource: imageUrl
        }
        addScene("newScene", newConfig, () => loadScene("newScene"));
        setTurnToOtherLaneSelector(false);
      } else {
        didMountFirstUrl.current = true;
      };
    }, [imageUrl, turnToOtherLane]);
  }

  useRenderPannellumViewer(imageUrl);

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
