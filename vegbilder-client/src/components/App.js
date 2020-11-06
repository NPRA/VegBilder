import React from "react";
import { ThemeProvider, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Header from "./Header/Header";
import MapContainer from "./MapContainer/MapContainer";
import SmallMapContainer from "./MapContainer/SmallMapContainer";
import ImageViewer from "./ImageViewer/ImageViewer";
import { CurrentImagePointProvider } from "../contexts/CurrentImagePointContext";
import { CurrentCoordinatesProvider } from "../contexts/CurrentCoordinatesContext";
import { LoadedImagePointsProvider } from "../contexts/LoadedImagePointsContext";
import { CommandProvider } from "../contexts/CommandContext";
import Footer from "./Footer/Footer";
import theme from "../theme/Theme";
import { MiniMapProvider } from "../contexts/MiniMapContext";

const useStyles = makeStyles({
  gridRoot: {
    height: "100%",
  },
  header: {
    flex: "0 1 auto", // Do not allow the grid item containing the header to grow. Height depends on content
    zIndex: "1000000",
  },
  content: {
    flex: "1 1 auto", // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: "relative", // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
  footer: {
    flex: "0 1 auto",
    zIndex: "1000000",
  },
});

function App() {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <CommandProvider>
        <CurrentCoordinatesProvider>
          <CurrentImagePointProvider>
            <LoadedImagePointsProvider>
              <BrowserRouter>
                <Grid container direction="column" className={classes.gridRoot}>
                  <Grid item className={classes.header}>
                    <Header />
                  </Grid>
                  <Switch>
                    <Route path="/bilde">
                      <MiniMapProvider>
                        <Grid item className={classes.content}>
                          <SmallMapContainer />
                          <ImageViewer />
                        </Grid>
                        <Grid item className={classes.footer}>
                          <Footer />
                        </Grid>
                      </MiniMapProvider>
                    </Route>
                    <Route path="/">
                      <Grid item className={classes.content}>
                        <MapContainer />
                      </Grid>
                    </Route>
                  </Switch>
                </Grid>
              </BrowserRouter>
            </LoadedImagePointsProvider>
          </CurrentImagePointProvider>
        </CurrentCoordinatesProvider>
      </CommandProvider>
    </ThemeProvider>
  );
}

export default App;
