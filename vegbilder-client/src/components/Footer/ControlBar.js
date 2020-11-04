import React from "react";
import { IconButton, Toolbar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useCommand, commandTypes } from "../../contexts/CommandContext";

import {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  HistoryIcon,
  MapIcon,
  MeasureIcon,
  PlayIcon,
} from "../Icons/Icons";

const useStyles = makeStyles({
  button: {
    margin: "0.2em",
  },
});

export default function ControlBar() {
  const classes = useStyles();
  const { setCommand } = useCommand();

  return (
    <Toolbar>
      <IconButton
        aria-label="Gå fremover"
        className={classes.button}
        onClick={() => setCommand(commandTypes.goForwards)}
      >
        <ArrowUpIcon />
      </IconButton>
      <IconButton
        aria-label="Gå bakover"
        className={classes.button}
        onClick={() => setCommand(commandTypes.goBackwards)}
      >
        <ArrowDownIcon />
      </IconButton>
      <IconButton aria-label="Bytt kjøreretning" className={classes.button}>
        <ArrowTurnIcon />
      </IconButton>
      <IconButton aria-label="Start animasjon" className={classes.button}>
        <PlayIcon />
      </IconButton>
      <IconButton aria-label="Skjul kart" className={classes.button}>
        <MapIcon />
      </IconButton>
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
