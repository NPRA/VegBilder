import React, { useState } from "react";
import { Grid } from "semantic-ui-react";

import MapView from "./MapView/MapView";
import ImageView from "./ImageView/ImageView";
import ImageMetadataView from "./ImageMetadataView/ImageMetadataView";
import Search from "./Search/Search";

function App() {
  const [currentLocation, setCurrentLocation] = useState({
    lat: 59.96,
    lng: 11.05,
  });
  const [currentImagePoint, setCurrentImagePoint] = useState(null);
  return (
    <Grid columns={2}>
      <Grid.Column>
        <ImageView
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
        <ImageMetadataView currentImagePoint={currentImagePoint} />
      </Grid.Column>
      <Grid.Column>
        <Search
          setCurrentLocation={setCurrentLocation}
          setCurrentImagePoint={setCurrentImagePoint}
        ></Search>
        <MapView
          currentLocation={currentLocation}
          currentImagePoint={currentImagePoint}
          setCurrentImagePoint={setCurrentImagePoint}
        />
      </Grid.Column>
    </Grid>
  );
}

export default App;
