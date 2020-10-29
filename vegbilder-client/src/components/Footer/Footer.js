import React from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import ControlBar from "./ControlBar";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    borderTop: `1px solid ${theme.palette.common.grayDark}`,
    width: "100vw",
    height: "10em",
  },
  imageMetadata: {
    width: "10em",
  },
  rightItem: {
    width: "10em",
  },
}));

export default function Footer() {
  const classes = useStyles();
  return (
    <div className={classes.footer}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          <div className={classes.imageMetadata}>Image metadata</div>
        </Grid>
        <Grid item>
          <ControlBar />
        </Grid>
        <Grid item>
          <div className={classes.rightItem}></div>
        </Grid>
      </Grid>
    </div>
  );
}
