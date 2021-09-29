import React, {useEffect, useRef, useState} from 'react';
import ReactPannellum, {getPitch, addScene, loadScene, getYaw, setHfov, getHfov} from 'react-pannellum';
import {useRecoilValue} from 'recoil';
import {hfovState} from '../../../../recoil/selectors';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const ThreeSixtyImage = ({ imageUrl }) => {

  const hfov = useRecoilValue(hfovState);

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

  const useRenderViewer = (imageUrl) => {
    const didMountFirstUrl = useRef(false);

    // Pannellum-biblioteket oppdaterer ikke komponenten automatisk ved ny prop. Må derfor legge til og laste inn nytt bilde som ny scene hver gang.
    useEffect(() => {
      if (didMountFirstUrl.current) {
        let newConfig = {
          ...config,
          pitch: getPitch(),
          yaw: getYaw(),
          imageSource: imageUrl
        }
        addScene("newScene", newConfig, () => loadScene("newScene"));
      } else {
        didMountFirstUrl.current = true;
      };
    }, [imageUrl]);
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
        config={config}
        hfov={null}
        style={{
          objectFit: 'contain',
          margin: '0 auto',
          fontFamily: '"LFT-Etica"',
          color: Theme.palette.common.grayRegular,
        }}
        /> 
    </>
  );
};

export default ThreeSixtyImage;
