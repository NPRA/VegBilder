import React from "react";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    top: "0.3125rem",
    right: "0.3125rem",
    opacity: "50%",
  },
}));

export default function CloseButton(props) {
  const classes = useStyles();
  return (
    <IconButton className={classes.closeButton} {...props}>
      <CloseIcon />
    </IconButton>
  );
}
