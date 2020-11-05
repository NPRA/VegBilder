import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar, Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import Search from "../Search/Search";

const useStyles = makeStyles({
  logo: {
    padding: "0.5em",
    width: "9em",
  },
  rightItem: {
    width: "10em",
  },
});

export default function Header() {
  const classes = useStyles();
  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
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
