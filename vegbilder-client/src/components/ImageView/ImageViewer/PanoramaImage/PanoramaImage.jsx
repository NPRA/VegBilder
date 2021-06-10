import React from 'react';
import ReactPannellum from 'react-pannellum';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const ThreeSixtyImage = ({ imageUrl }) => {
  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

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
        imageSource={imageUrl}
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
};

export default ThreeSixtyImage;
