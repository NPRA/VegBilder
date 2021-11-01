import React, {useEffect, useRef} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, getHfov} from 'react-pannellum';
import {useRecoilState} from 'recoil';
import { pannellumSettings } from "constants/settings";
import {currentViewState, currentPannellumHfovState} from '../../../../recoil/atoms';
import { turnedToOtherLaneSelector } from '../../../../recoil/selectors';
import { makeStyles } from '@material-ui/core/styles';
import { PanoramaLabelIcon } from 'components/Icons/Icons';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const useStyles = makeStyles((theme) => ({
  label: {
    position: 'absolute',
    cursor: 'default',
    bottom: '4px',
    right: '4px',
    '& svg' : {
      verticalAlign: 'top'
    }
  }
}))

const PanoramaImage = ({ imageUrl }) => {
  const classes = useStyles();
  const [currentView, ] = useRecoilState(currentViewState);
  const [turnToOtherLane, setTurnToOtherLaneSelector] = useRecoilState(turnedToOtherLaneSelector);
  const [, setPannellumHfovState] = useRecoilState(currentPannellumHfovState);

  const isPreview = currentView === 'map';

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
    compass: !isPreview
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
        config={pannellumConfig}
        style={pannellumStyle}
        /> 
        <div className={classes.label}>
          <PanoramaLabelIcon/>
        </div>
    </>
  );
};

export default PanoramaImage;
