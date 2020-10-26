import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Search from "../Search/Search";

const useStyles = makeStyles({
  logo: {
    padding: "0.5em",
    height: "5em",
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>
        <img src="images/svv-logo.svg" className={classes.logo} />

        <Grid container direction="row" justify="center">
          <Grid item>
            <Search />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
