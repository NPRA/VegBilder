import React from "react";
import ReactPannellum from "react-pannellum";
import Theme from "theme/Theme";
import testImg from './test-img.png';
import './panellumStyle.css';


const ThreeSixtyImage = () => {

  const uiText = {
    bylineLabel: '',
    loadingLabel: "Laster...",
  }

  const config = {
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
  };

    return (
      <>
        <ReactPannellum
          id="1"
          sceneId="firstScene"
          imageSource={testImg}
          config={config}
          style={{
          objectFit: 'contain',
          margin: '0 auto',
          fontFamily: '"LFT-Etica"',
          color: Theme.palette.common.grayRegular,
          }}
        />
      </>
    );
  }

export default ThreeSixtyImage;