import React from "react";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  imageContainer: {
    width: "100vw",
    height: "100%",
    backgroundColor: "blue",
  },
}));

export default function ImageViewer() {
  const classes = useStyles();
  const { currentImagePoint } = useCurrentImagePoint();
  return (
    <div className={classes.imageContainer}>
    </div>
  );
}
