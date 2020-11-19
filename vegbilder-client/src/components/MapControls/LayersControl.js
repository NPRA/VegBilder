import React from "react";
import { IconButton } from "@material-ui/core";
import LayersRoundedIcon from "@material-ui/icons/LayersRounded";

export default function LayersControl(props) {
  return (
    <IconButton {...props}>
      <LayersRoundedIcon />
    </IconButton>
  );
}
