import React, { useState } from "react";
import { Grid } from "semantic-ui-react";

import MapView from "./MapView/MapView";
import ImageView from "./ImageView/ImageView";

function App() {
  const [currentImage, setCurrentImage] = useState(null);
  return (
    <Grid columns={2}>
      <Grid.Column>
        <ImageView currentImage={currentImage} />
      </Grid.Column>
      <Grid.Column>
        <MapView />
      </Grid.Column>
    </Grid>
  );
}

export default App;
