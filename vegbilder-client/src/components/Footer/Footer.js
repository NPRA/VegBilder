import React from "react";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: theme.palette.primary.main,
    borderTop: `1px solid ${theme.palette.common.grayDark}`,
    width: "100vw",
    height: "10em",
  },
}));

export default function Footer() {
  const classes = useStyles();
  return <div className={classes.footer}></div>;
}
