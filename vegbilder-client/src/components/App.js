import React from "react";
import { ThemeProvider } from "@material-ui/core";

import Header from "./Header/Header";
import MapContainer from "./MapContainer/MapContainer";
import theme from "../theme/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header>Vegbilder</Header>
      <MapContainer></MapContainer>
    </ThemeProvider>
  );
}

export default App;
