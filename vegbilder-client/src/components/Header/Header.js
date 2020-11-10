import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Search from "../Search/Search";

const useStyles = makeStyles({
  headerAppBar: {
    height: "100%",
  },
  headerToolBar: {
    height: "100%",
    paddingLeft: "4.125rem",
    paddingRight: "4.125rem",
  },
  logoContainer: {
    display: "flex",
    alignContent: "center",
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
      className={classes.headerAppBar}
    >
      <Toolbar className={classes.headerToolBar} disableGutters>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="center"
        >
          <Grid item className={classes.logoContainer}>
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
