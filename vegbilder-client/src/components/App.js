import React from "react";
import { ThemeProvider } from "@material-ui/core";

import Header from "./Header";
import Map from "./Map";
import theme from "../theme/Theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Header>Vegbilder</Header>
      <Map></Map>
    </ThemeProvider>
  );
}

export default App;
