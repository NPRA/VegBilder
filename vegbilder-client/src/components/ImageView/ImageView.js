import React from "react";
import { Image } from "semantic-ui-react";

const ImageView = (props) => {
  const { currentImagePoint } = props;
  const imageUrl =
    currentImagePoint === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImagePoint.properties.Url;
  return <Image src={imageUrl} />;
};

export default ImageView;
