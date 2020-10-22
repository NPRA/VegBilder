import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";

export default function Header() {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Toolbar>Vegbilder</Toolbar>
    </AppBar>
  );
}
