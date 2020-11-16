import React from "react";
import { Box, Button, Grid, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";
import { useHistory } from "react-router-dom";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import {
  getImageUrl,
  getImagePointLatLng,
} from "../../utilities/imagePointUtilities";
import ImageMetadata from "../ImageMetadata/ImageMetadata";
import { EnlargeIcon } from "../Icons/Icons";
import { CloseButton } from "../Buttons/Buttons";

const useStyles = makeStyles((theme) => ({
  image: {
    height: "12.5rem",
    margin: "2px 2px 0 2px",
  },
  enlargeButton: {
    backgroundColor: theme.palette.common.grayDark,
    borderRadius: "0.625rem",
    //padding: "3px",
    "& span": {
      "& svg": {
        width: "21px",
        height: "21px",
      },
    },
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
          <CloseButton onClick={() => setCurrentImagePoint(null)} />
        </Box>
        <Box padding="0.75rem" display="flex" justifyContent="space-between">
          <ImageMetadata />
          <IconButton className={classes.enlargeButton} onClick={openImage}>
            <EnlargeIcon />
          </IconButton>
        </Box>
      </Box>
    );
  } else return null;
}
