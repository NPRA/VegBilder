import React, { useState } from "react";
import { Checkbox, FormControlLabel, makeStyles } from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import CloseButton from "../CloseButton/CloseButton";

const useStyles = makeStyles((theme) => ({
  splash: {
    position: "absolute",
    transform: "translate(-50%, -50%)",
    top: "50%",
    left: "50%",
    width: "50rem",
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
          <h1>Velkommen til Vegbilder</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer eu
            neque eget eros interdum condimentum sed rutrum orci. Etiam cursus
            ac leo luctus tincidunt. Nunc consequat pellentesque magna ut
            fermentum. Etiam sit amet elementum tellus. Vestibulum ante ipsum
            primis in faucibus orci luctus et ultrices posuere cubilia curae;
            Curabitur facilisis sem quam, nec tempus justo tempus eu. Aenean
            congue urna sed lorem dictum tempor. Sed eget accumsan velit, in
            ultricies urna. Pellentesque eu risus non velit maximus rutrum.
          </p>
          <p>
            Nulla viverra neque eget suscipit suscipit. Nam eget volutpat orci,
            eu posuere nisl. Nunc malesuada, elit vel sagittis molestie, mi mi
            rhoncus diam, quis volutpat turpis nibh sit amet quam. Nulla vitae
            est ac enim vehicula bibendum. Maecenas sed ornare lectus. Curabitur
            dapibus non orci id lacinia. Donec eu maximus eros. Maecenas
            elementum varius bibendum. Pellentesque non nisi vel nisl convallis
            volutpat. Nulla facilisi. Nullam ac eros et odio pulvinar posuere.
            Proin commodo libero ut nunc maximus, eget semper neque fringilla.
            Nam sit amet metus quam. Integer pretium ante et aliquet tincidunt.
            Vestibulum sit amet lectus a diam sodales consequat. Morbi gravida
            risus libero, sit amet tincidunt turpis ullamcorper et.
          </p>
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
