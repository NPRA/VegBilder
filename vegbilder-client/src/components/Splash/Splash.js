import React, { useState } from "react";
import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import CloseButton from "../CloseButton/CloseButton";
import { splashScreenText } from "../../configuration/text";

const useStyles = makeStyles((theme) => ({
  splash: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    width: "50rem",
    maxHeight: "70vh",
    overflowY: "auto",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  content: {
    margin: "2rem",
  },
  checkbox: {
    backgroundColor: "transparent",
    color: theme.palette.primary.contrastText,
  },
}));

const HIDE_SPLASH_ON_STARTUP = "HideSplashOnStartup";

export default function Splash() {
  const classes = useStyles();
  const hideWasSet = localStorage.getItem(HIDE_SPLASH_ON_STARTUP) === "true";
  const [visible, setVisible] = useState(!hideWasSet);
  const [hideOnStartup, setHideOnStartup] = useState(hideWasSet);
  if (!visible) return null;

  function closeSplash() {
    setVisible(false);
  }

  function handleStartupChange() {
    hideOnStartup
      ? localStorage.removeItem(HIDE_SPLASH_ON_STARTUP)
      : localStorage.setItem(HIDE_SPLASH_ON_STARTUP, "true");
    setHideOnStartup(!hideOnStartup);
  }

  if (!visible) return null;
  return (
    <ClickAwayListener onClickAway={closeSplash}>
      <div className={classes.splash}>
        <CloseButton onClick={closeSplash} />
        <div className={classes.content}>
          <h1>{splashScreenText.header}</h1>
          {splashScreenText.paragraphs.map((paragraph) => (
            <p>{paragraph}</p>
          ))}
          <FormControlLabel
            control={
              <Checkbox
                className={classes.checkbox}
                onChange={handleStartupChange}
              />
            }
            label={"Ikke vis ved oppstart"}
          ></FormControlLabel>
        </div>
      </div>
    </ClickAwayListener>
  );
}
