import React from 'react';
import { Box } from '@material-ui/core';
//import { makeStyles } from "@material-ui/styles"

import ZoomControl from './ZoomControl';
//import LayersControl from "./LayersControl";

/*const useStyles = makeStyles({
  buttonWithBottomMargin: {
    marginBottom: "0.625rem",
  },
});*/

export default function MapControls() {
  //const classes = useStyles();
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      position={'absolute'}
      top={'2rem'}
      right={'1rem'}
      zIndex={10000}
    >
      {/* <LayersControl className={classes.buttonWithBottomMargin} /> */}
      <ZoomControl />
    </Box>
  );
}
