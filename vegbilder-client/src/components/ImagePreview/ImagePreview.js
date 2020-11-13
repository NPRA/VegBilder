import React from "react";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import CloseIcon from "@material-ui/icons/Close";
import { useHistory } from "react-router-dom";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import {
  getImageUrl,
  getImagePointLatLng,
} from "../../utilities/imagePointUtilities";
import ImageMetadata from "../ImageMetadata/ImageMetadata";
import { EnlargeIcon } from "../Icons/Icons";

const useStyles = makeStyles((theme) => ({
  image: {
    height: "12.5rem",
    margin: "2px 2px 0 2px",
  },
  button: {
    backgroundColor: theme.palette.common.grayDark,
    borderRadius: "10px",
  },
}));

export default function ImagePreview() {
  const classes = useStyles();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const history = useHistory();

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);
    function openImage() {
      setCurrentCoordinates({ latlng: latlng, zoom: 16 });
      history.push("/bilde");
    }

    return (
      <Box
        position="absolute"
        right="1.1875rem"
        bottom="1.1875rem"
        zIndex="1"
        borderRadius="3px"
        bgcolor="primary.main"
        color="primary.contrastText"
        display="flex"
        flexDirection="column"
      >
        <Box>
          <img
            src={getImageUrl(currentImagePoint)}
            className={classes.image}
          ></img>
        </Box>
        <Box padding="0.75rem" display="flex" justifyContent="space-between">
          <ImageMetadata />
          <IconButton className={classes.button} onClick={openImage}>
            <EnlargeIcon />
          </IconButton>
        </Box>
      </Box>
    );
  } else return null;
}
