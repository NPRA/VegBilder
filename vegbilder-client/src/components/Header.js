import React from "react";
import AppBar from "@material-ui/core/AppBar";
import { Toolbar } from "@material-ui/core";

export default function Header() {
  return (
    <AppBar position="fixed" color="primary">
      <Toolbar>Vegbilder</Toolbar>
    </AppBar>
  );
}
