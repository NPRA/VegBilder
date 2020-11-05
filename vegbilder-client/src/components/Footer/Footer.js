import React from "react";
import { AppBar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ImageMetadata from "./ImageMetadata";
import ControlBar from "./ControlBar";

const useStyles = makeStyles((theme) => ({
  appbar: {
    backgroundColor: theme.palette.primary.main,
    borderTop: `1px solid ${theme.palette.common.grayDark}`,
    width: "100vw",
    height: "5rem",
    paddingLeft: "2rem",
    paddingRight: "2rem",
  },
  imageMetadata: {
    width: "20rem",
  },
  rightItem: {
    width: "20rem",
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <AppBar position="relative" className={classes.appbar}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <div className={classes.imageMetadata}>
            <ImageMetadata />
          </div>
        </Grid>
        <Grid item>
          <ControlBar />
        </Grid>
        <Grid item>
          <div className={classes.rightItem}></div>
        </Grid>
      </Grid>
    </AppBar>
  );
}
