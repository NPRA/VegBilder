import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import MapContainer from "./MapContainer/MapContainer";
import SmallMapContainer from "./MapContainer/SmallMapContainer";
import ImageViewer from "./ImageViewer/ImageViewer";
import ImagePreview from "./ImagePreview/ImagePreview";
import Splash from "./Splash/Splash";
import { MiniMapProvider } from "../contexts/MiniMapContext";
import useQueryParamState from "../hooks/useQueryParamState";

const useStyles = makeStyles({
  gridRoot: {
    height: "100%",
  },
  header: {
    flex: "0 1 5rem", // Do not allow the grid item containing the header to grow. Height depends on content
    zIndex: "1",
  },
  content: {
    flex: "1 1 auto", // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: "relative", // Needed for the small map to be positioned correctly relative to the top left corner of the content container
  },
  footer: {
    flex: "0 1 4.5rem",
  },
});

const views = {
  mapView: "map",
  imageView: "image",
};

function isValidView(view) {
  return view === views.mapView || view === views.imageView;
}

function ComponentsWrapper() {
  const classes = useStyles();
  const [view, setView] = useQueryParamState(
    "view",
    views.mapView,
    isValidView
  );

  function renderMapView() {
    return (
      <Grid item className={classes.content}>
        <MapContainer />
        <ImagePreview
          openImageView={() => {
            setView(views.imageView);
          }}
        />
      </Grid>
    );
  }

  function renderImageView() {
    return (
      <MiniMapProvider>
        <Grid item className={classes.content}>
          <SmallMapContainer />
          <ImageViewer
            exitImageView={() => {
              setView(views.mapView);
            }}
          />
        </Grid>
        <Grid item className={classes.footer}>
          <Footer />
        </Grid>
      </MiniMapProvider>
    );
  }

  function renderContent() {
    switch (view) {
      case views.mapView:
        return renderMapView();
        break;
      case views.imageView:
        return renderImageView();
        break;
      default:
        throw Error("No valid view set");
    }
  }

  return (
    <>
      <Grid
        container
        direction="column"
        className={classes.gridRoot}
        wrap="nowrap"
      >
        <Grid item className={classes.header}>
          <Header />
        </Grid>
        {renderContent()}
      </Grid>
      <Splash />
    </>
  );
}

export default ComponentsWrapper;
