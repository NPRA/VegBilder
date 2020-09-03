import React from "react";
import { Grid, Image } from "semantic-ui-react";

import MapView from "./MapView/MapView";

function App() {
  return (
    <Grid columns={2}>
      <Grid.Column>
        <Image src="https://react.semantic-ui.com/images/wireframe/image.png" />
      </Grid.Column>
      <Grid.Column>
        <MapView />
      </Grid.Column>
    </Grid>
  );
}

export default App;
