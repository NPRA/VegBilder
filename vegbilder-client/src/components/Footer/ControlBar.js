import React, { useEffect } from "react";
import { IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { useMiniMap } from "../../contexts/MiniMapContext";
import {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  HistoryIcon,
  MapIcon,
  MapDisabledIcon,
  MeasureIcon,
  PlayIcon,
} from "../Icons/Icons";

const useStyles = makeStyles({
  button: {
    margin: "1.25rem",
    backgroundColor: "transparent",
  },
});

export default function ControlBar() {
  const classes = useStyles();
  const { setCommand } = useCommand();
  const { miniMapVisible, setMiniMapVisible } = useMiniMap();

  useEffect(() => {
    const onKeyDown = (event) => {
      switch (event.key) {
        case "ArrowDown":
          setCommand(commandTypes.goBackwards);
          break;
        case "ArrowUp":
          setCommand(commandTypes.goForwards);
          break;
        default:
        // Ignore other key presses
      }
    };
    document.body.addEventListener("keydown", onKeyDown);
    return function cleanUp() {
      document.body.removeEventListener("keydown", onKeyDown);
    };
  }, [setCommand]);

  return (
    <Toolbar>
      <IconButton
        aria-label="Gå bakover"
        className={classes.button}
        onClick={() => setCommand(commandTypes.goBackwards)}
      >
        <ArrowDownIcon />
      </IconButton>
      <IconButton
        aria-label="Gå fremover"
        className={classes.button}
        onClick={() => setCommand(commandTypes.goForwards)}
      >
        <ArrowUpIcon />
      </IconButton>
      <IconButton
        aria-label="Bytt kjøreretning"
        className={classes.button}
        onClick={() => setCommand(commandTypes.turnAround)}
      >
        <ArrowTurnIcon />
      </IconButton>
      <IconButton aria-label="Start animasjon" className={classes.button}>
        <PlayIcon />
      </IconButton>
      {miniMapVisible ? (
        <IconButton
          aria-label="Skjul kart"
          className={classes.button}
          onClick={() => setMiniMapVisible(false)}
        >
          <MapIcon />
        </IconButton>
      ) : (
        <IconButton
          aria-label="Vis kart"
          className={classes.button}
          onClick={() => setMiniMapVisible(true)}
        >
          <MapDisabledIcon />
        </IconButton>
      )}
      <IconButton aria-label="Mål avstand" className={classes.button}>
        <MeasureIcon />
      </IconButton>
      <IconButton
        aria-label="Finn bilder herfra på andre datoer"
        className={classes.button}
      >
        <HistoryIcon />
      </IconButton>
      <IconButton aria-label="Flere funksjoner" className={classes.button}>
        <DotsHorizontalIcon />
      </IconButton>
    </Toolbar>
  );
}
