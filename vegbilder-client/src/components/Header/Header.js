import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  toolbarMargin: {
    ...theme.mixins.toolbar,
  },
}));

export default function Header() {
  const classes = useStyles();
  return (
    <>
      <AppBar position="fixed" color="primary" elevation={0}>
        <Toolbar>Vegbilder</Toolbar>
      </AppBar>
      <div className={classes.toolbarMargin} />
    </>
  );
}
