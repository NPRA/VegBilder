import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Search from "../Search/Search";

const useStyles = makeStyles({
  headerBar: {
    height: "100%",
  },
  logo: {
    width: "7.5rem",
  },
  rightItem: {
    width: "7.5rem",
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar
      position="static"
      color="primary"
      elevation={3}
      className={classes.headerBar}
    >
      <Toolbar className={classes.headerBar}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item>
            <img
              src="images/svv-logo.svg"
              alt="Logo - Statens vegvesen"
              className={classes.logo}
            />
          </Grid>
          <Grid item>
            <Search />
          </Grid>
          <Grid item>
            <div className={classes.rightItem}></div>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
