import React, {useState} from 'react';
import ReactPannellum from 'react-pannellum';
import Theme from 'theme/Theme';
import './panellumStyle.css';

const ThreeSixtyImage = ({ imageUrl }) => {

  const [currentImageUrl, setCurrentImageUrl] = useState("");

  const uiText = {
    bylineLabel: '',
    loadingLabel: '',
  };

  const config = {
    autoLoad: true,
    showZoomCtrl: false,
    showFullscreenCtrl: false,
    uiText: uiText,
    preview: imageUrl
  };

  
  let image360viewer =  new ReactPannellum();
  image360viewer =
  <ReactPannellum
        id="1"
        sceneId="initialScene"
        imageSource={imageUrl}
        config={config}
        style={{
          objectFit: 'contain',
          margin: '0 auto',
          fontFamily: '"LFT-Etica"',
          color: Theme.palette.common.grayRegular,
        }}
/>


if (currentImageUrl !== imageUrl) {
  setCurrentImageUrl(imageUrl);
  image360viewer.type.addScene("currentScene", {imageSource: currentImageUrl, preview: currentImageUrl});
  image360viewer.type.loadScene("currentScene");
}


  return (
    <>
     {image360viewer}
    </>
  );
};

export default ThreeSixtyImage;
