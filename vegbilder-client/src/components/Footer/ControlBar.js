import React, { useEffect } from "react";
import IconButton from "@material-ui/core/IconButton";
import Toolbar from "@material-ui/core/Toolbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ReportIcon from "@material-ui/icons/Report";
import ShareIcon from "@material-ui/icons/Share";
import GetAppIcon from "@material-ui/icons/GetApp";

import { useCommand, commandTypes } from "../../contexts/CommandContext";
import { useMiniMap } from "../../contexts/MiniMapContext";
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
import {getShareableUrlForImage} from "../../utilities/urlUtilities";

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
  const { currentImagePoint } = useCurrentImagePoint();
  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = React.useState(null);
  const [isCopied, handleCopy] = useCopyToClipboard();

  const handleMoreControlsClick = (event) => {
    setMoreControlsAnchorEl(event.currentTarget);
  };

  const handleMoreControlsClose = () => {
    setMoreControlsAnchorEl(null);
  };

  function copyShareableUrlToClipboard() {
    const shareableUrl = getShareableUrlForImage(currentImagePoint);
    handleCopy(shareableUrl);
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
        <IconButton
          aria-label="Flere funksjoner"
          onClick={handleMoreControlsClick}
          className={classes.button}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Toolbar>
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
        <MenuItem>
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
          <ListItemText primary="Meld feil" />
        </MenuItem>
        <MenuItem onClick={copyShareableUrlToClipboard}>
          <ListItemIcon>
            <ShareIcon />
          </ListItemIcon>
          <ListItemText primary="Del" />
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <GetAppIcon />
          </ListItemIcon>
          <ListItemText primary="Last ned" />
        </MenuItem>
      </Menu>
    </>
  );
}
