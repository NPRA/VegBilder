import React from "react";
import { Image } from "semantic-ui-react";

const ImageView = (props) => {
  const { currentImage } = props;
  const imageUrl =
    currentImage === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImage.Url;
  return <Image src={imageUrl} />;
};

export default ImageView;
