import React from "react";
import { ThemeProvider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "./Header/Header";
import MapContainer from "./MapContainer/MapContainer";
import ImageViewer from "./ImageViewer/ImageViewer";
import { CurrentImagePointProvider } from "../contexts/CurrentImagePointContext";
import { CurrentCoordinatesProvider } from "../contexts/CurrentCoordinatesContext";
import theme from "../theme/Theme";

const useStyles = makeStyles({
  gridRoot: {
    height: "100%",
  },
  header: {
    flex: "0 1 auto", // Do not allow the grid item containing the header to grow. Height depends on content
  },
  content: {
    flex: "1 1 auto", // Allow the grid item containing the main content to grow and shrink to fill the available height.
  },
});

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CurrentCoordinatesProvider>
        <CurrentImagePointProvider>
          <BrowserRouter>
            <Grid container direction="column" className={classes.gridRoot}>
              <Grid item className={classes.header}>
                <Header />
              </Grid>
              <Switch>
                <Route path="/bilde">
                  <Grid item className={classes.content}>
                    <ImageViewer />
                  </Grid>
                </Route>
                <Route path="/">
                  <Grid item className={classes.content}>
                    <MapContainer />
                  </Grid>
                </Route>
              </Switch>
            </Grid>
          </BrowserRouter>
        </CurrentImagePointProvider>
      </CurrentCoordinatesProvider>
    </ThemeProvider>
  );
}

export default App;
