import React from "react";
import { Image } from "semantic-ui-react";

const ImageView = ({ currentImagePoint }) => {
  const imageUrl =
    currentImagePoint === null
      ? "https://react.semantic-ui.com/images/wireframe/image.png"
      : currentImagePoint.properties.URL;
  console.log(`About to render image: ${imageUrl}`);
  return <Image src={imageUrl} />;
};

export default ImageView;
