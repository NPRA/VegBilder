import React, { useState } from "react";
import { Grid } from "semantic-ui-react";

import MapView from "./MapView/MapView";
import ImageView from "./ImageView/ImageView";

function App() {
  const [currentImagePoint, setCurrentImagePoint] = useState(null);
  return (
    <Grid columns={2}>
      <Grid.Column>
        <ImageView currentImagePoint={currentImagePoint} />
      </Grid.Column>
      <Grid.Column>
        <MapView
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
      </Grid.Column>
    </Grid>
  );
}

export default App;
