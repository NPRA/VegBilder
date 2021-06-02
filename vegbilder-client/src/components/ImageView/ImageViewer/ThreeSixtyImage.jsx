import React from "react";
import ReactPannellum from "react-pannellum";
import Theme from "theme/Theme";
import testImg from './test-img.png';
import './style.css';


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

  // const authorBox = document.getElementsByClassName('pnlm-panorama-info').item(0);

  // if (authorBox){
  //   authorBox.style['display'] = 'none';
  // }
   

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