import React from "react";
import { IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    top: "0.3125rem",
    right: "0.3125rem",
    backgroundColor: theme.palette.common.grayDark,
    opacity: "50%",
    color: theme.palette.primary.contrastText,
    padding: "0.1875rem",
    borderRadius: "0.625rem",
  },
}));

function CloseButton(props) {
  const classes = useStyles();
  return (
    <IconButton className={classes.closeButton} {...props}>
      <CloseIcon />
    </IconButton>
  );
}

export { CloseButton };
