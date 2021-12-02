import React, {useEffect, useRef} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, getHfov, resize, toggleFullscreen } from 'react-pannellum';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { defaultPannellumSettings } from "constants/settings";
import { currentPannellumHfovState, panoramaFullscreenIsOnState } from 'recoil/atoms';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const PanoramaImage = ({ imageUrl, isHistoryMode }) => {
  const [, setPannellumHfovState] = useRecoilState(currentPannellumHfovState);
  const [panoramaFullscreenIsOn, setPanoramaFullscreenIsOn] = useRecoilState(panoramaFullscreenIsOnState);

  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

  // These are needed for other react components to be able to "subscribe" to changes in
  // pannellum's internal zoom and fullscreen state. 
  const updateZoomRecoilState = () => {
    setPannellumHfovState(getHfov());
  };

  const updateFullscreenRecoilState = (newState) => {
    setPanoramaFullscreenIsOn(newState);
  }

  const pannellumConfig = {
    minHfov: defaultPannellumSettings.minHfovBounds,
    maxHfov: defaultPannellumSettings.maxHfovBounds,
    hfov: defaultPannellumSettings.defaultHfov,
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
    doubleClickZoom: true,
    displayAboutInformation: false,
    displayLoadingSpinner: false,
    onScrollZoom: updateZoomRecoilState,
    onFullscreenToggle: updateFullscreenRecoilState,
    compass: true
  };

  const pannellumStyle = {
    objectFit: 'contain',
    margin: '0 auto',
    fontFamily: '"LFT-Etica"',
    color: Theme.palette.common.grayRegular,
    background: Theme.palette.common.grayDarker
  }

  const deactivatePanoramaFullscreen = () => {
    if (panoramaFullscreenIsOn) {
      toggleFullscreen();
    }
  }

    /*  
      Image source changes does not cause a re-render of Pannellum.
      We therefore need to force Pannellum to update with a new image using add and load scene
      whenever imageUrl is changed (except for first render).
    */
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
        >
          {panoramaFullscreenIsOn && 
          <CloseButton onClick={deactivatePanoramaFullscreen} positionToTop={'1rem'} positionToRight={'1rem'} zIndex={2} />}
        </ReactPannellum> 
    </>
  );
};

export default PanoramaImage;
