import React from "react";
import { Box, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/styles";

import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import {
  getImageUrl,
  getImagePointLatLng,
} from "../../utilities/imagePointUtilities";
import ImageMetadata from "../ImageMetadata/ImageMetadata";
import { EnlargeIcon } from "../Icons/Icons";
import CloseButton from "../CloseButton/CloseButton";

const useStyles = makeStyles((theme) => ({
  image: {
    width: "30rem",
    margin: "2px 2px 0 2px",
  },
  enlargeButton: {
    "& span": {
      "& svg": {
        width: "21px",
        height: "21px",
      },
    },
  },
}));

export default function ImagePreview({ openImageView }) {
  const classes = useStyles();
  const { currentImagePoint, unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCurrentCoordinates } = useCurrentCoordinates();

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);

    function openImage() {
      setCurrentCoordinates({ latlng: latlng, zoom: 16 });
      openImageView();
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
            alt="Bilde tatt langs veg"
          ></img>
          <CloseButton onClick={unsetCurrentImagePoint} />
        </Box>
        <Box
          padding="0.25rem 0.75rem 0.75rem 0.75rem"
          display="flex"
          justifyContent="space-between"
        >
          <ImageMetadata />
          <IconButton className={classes.enlargeButton} onClick={openImage}>
            <EnlargeIcon />
          </IconButton>
        </Box>
      </Box>
    );
  } else return null;
}
