import React, { useEffect, useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ReportIcon from "@material-ui/icons/Report";
import ShareIcon from "@material-ui/icons/Share";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";

import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { useToggles } from "../../contexts/TogglesContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
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
import useCopyToClipboard from "../../hooks/useCopyToClipboard";
import { getShareableUrlForImage } from "../../utilities/urlUtilities";
import { createMailtoHrefForReporting } from "../../utilities/mailtoUtilities";
import { Browser } from "leaflet";
import { getImageUrl } from "../../utilities/imagePointUtilities";

const useStyles = makeStyles({
  button: {
    margin: "1.25rem",
    backgroundColor: "transparent",
  },
});

export default function ControlBar({ showMessage }) {
  const classes = useStyles();
  const { setCommand } = useCommand();
  const { miniMapVisible, setMiniMapVisible } = useToggles();
  const { currentImagePoint } = useCurrentImagePoint();
  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = useState(null);
  const { copyToClipboard } = useCopyToClipboard();

  const handleMoreControlsClick = (event) => {
    setMoreControlsAnchorEl(event.currentTarget);
  };

  const handleMoreControlsClose = () => {
    setMoreControlsAnchorEl(null);
  };

  function copyShareableUrlToClipboard() {
    const shareableUrl = getShareableUrlForImage(currentImagePoint);
    copyToClipboard(shareableUrl);
    showMessage("Lenke kopiert til utklippstavle");
  }

  function openPrefilledEmailInDefaultEmailClient() {
    window.open(createMailtoHrefForReporting(currentImagePoint), "_self");
    showMessage("Åpner e-post-klient");
  }

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
    <>
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
        {/*
        <IconButton aria-label="Start animasjon" className={classes.button}>
          <PlayIcon />
        </IconButton>
        */}
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
        {/*
        <IconButton aria-label="Mål avstand" className={classes.button}>
          <MeasureIcon />
        </IconButton>
        */}
        {/*
        <IconButton
          aria-label="Finn bilder herfra på andre datoer"
          className={classes.button}
        >

          <HistoryIcon />
        </IconButton>
        */}
        <IconButton
          aria-label="Flere funksjoner"
          onClick={handleMoreControlsClick}
          className={classes.button}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Toolbar>
      {currentImagePoint ? (
        <Menu
          id="more-controls-menu"
          anchorEl={moreControlsAnchorEl}
          keepMounted
          open={Boolean(moreControlsAnchorEl)}
          onClose={handleMoreControlsClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
        >
          <MenuItem
            onClick={() => {
              openPrefilledEmailInDefaultEmailClient();
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Meld feil" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              copyShareableUrlToClipboard();
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Del" />
          </MenuItem>
          <MenuItem
            onClick={() => {
              window.open(getImageUrl(currentImagePoint), "_blank", "noopener");
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <ListItemText primary="Åpne bilde i ny fane" />
          </MenuItem>
        </Menu>
      ) : null}
    </>
  );
}
