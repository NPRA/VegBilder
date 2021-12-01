import React, {useEffect, useRef} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, getHfov, resize} from 'react-pannellum';
import {useRecoilState} from 'recoil';
import { pannellumSettings } from "constants/settings";
import { currentPannellumHfovState } from 'recoil/atoms';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const PanoramaImage = ({ imageUrl, isHistoryMode }) => {
  const [, setPannellumHfovState] = useRecoilState(currentPannellumHfovState);

  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

  const updateZoomRecoilState = () => {
    setPannellumHfovState(getHfov());
  }

  const pannellumConfig = {
    minHfov: pannellumSettings.minHfovBounds,
    maxHfov: pannellumSettings.maxHfovBounds,
    hfov: pannellumSettings.defaultHfov,
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
    doubleClickZoom: true,
    displayAboutInformation: false,
    displayLoadingSpinner: false,
    onScrollZoom: updateZoomRecoilState,
    compass: true
  };

  const pannellumStyle = {
    objectFit: 'contain',
    margin: '0 auto',
    fontFamily: '"LFT-Etica"',
    color: Theme.palette.common.grayRegular,
    background: Theme.palette.common.grayDarker
  }

    // Pannellum-biblioteket oppdaterer ikke komponenten automatisk ved ny prop.
    // Må derfor legge til og laste inn nytt bilde som ny scene hver gang (unntatt første scene, derav useRef).
  const useRenderPannellumViewer = (imageUrl) => {
    const didMountFirstUrl = useRef(false);

    useEffect(() => {
      if (didMountFirstUrl.current) {
        let newConfig = {
          ...pannellumConfig,
          pitch: getPitch(),
          yaw: getYaw(),
          hfov: getHfov(),
          imageSource: imageUrl
        }
        addScene("newScene", newConfig, () => loadScene("newScene"));
      } else {
        didMountFirstUrl.current = true;
      };
    }, [imageUrl]);
  }


  const useResizePanoramaForHistoryMode = (isHistoryMode) => {

    //We don't need to call resize on first render. Only when opening and closing history.
    const hasMounted = useRef(false);
    useEffect(() => {
      if (hasMounted.current) {
        resize();
      } else {
        hasMounted.current = true;
      }
    }, [isHistoryMode])
  }

  useRenderPannellumViewer(imageUrl);
  useResizePanoramaForHistoryMode(isHistoryMode);


  return (
    <>
        <ReactPannellum
        id="1"
        sceneId="initialScene"
        imageSource={imageUrl}
        config={pannellumConfig}
        style={pannellumStyle}
        /> 
    </>
  );
};

export default PanoramaImage;
