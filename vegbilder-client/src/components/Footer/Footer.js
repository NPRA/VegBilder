import React from "react";
import { makeStyles } from "@material-ui/styles";
import { green } from "@material-ui/core/colors";

const useStyles = makeStyles({
  footer: {
    backgroundColor: "green",
    width: "100vw",
    height: "10em",
  },
});

export default function Footer() {
  const classes = useStyles();
  return <div className={classes.footer}></div>;
}
