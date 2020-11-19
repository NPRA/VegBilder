import React from "react";
import { Box } from "@material-ui/core";

import ZoomControl from "./ZoomControl";

export default function MapControls() {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      position={"absolute"}
      top={"1rem"}
      right={"1rem"}
      zIndex={10000}
    >
      <ZoomControl />
    </Box>
  );
}
