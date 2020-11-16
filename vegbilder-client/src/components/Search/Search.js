import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import { MagnifyingGlassIcon } from "../Icons/Icons";
import { fade, makeStyles } from "@material-ui/core/styles";
import { useHistory } from "react-router-dom";

import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import getVegByVegsystemreferanse from "../../apis/NVDB/getVegByVegsystemreferanse";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "auto",
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  inputRoot: {
    color: "inherit",
  },
  inputInput: {
    padding: theme.spacing(1.1, 1.1, 1.1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      width: "50ch",
      height: "3ch",
    },
  },
}));

const Search = () => {
  const classes = useStyles();
  const history = useHistory();
  const [searchString, setSearchString] = useState("");
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { setLoadedImagePoints } = useLoadedImagePoints();
  const { setCommand } = useCommand();

  const onChange = (event) => {
    setSearchString(event.target.value);
  };

  const onKeyDown = async (event) => {
    if (event.key === "Enter") {
      const latlng = await getCoordinates(searchString);
      if (latlng) {
        setCurrentCoordinates({ latlng: latlng, zoom: 16 });
        /* Since a search usually entails a big jump in location, the currently loaded image points
         * will most likely no longer be useful. We need to clear them in order for the
         * selectNearestImagePoint command to work. (Otherwise it will select an image point near
         * the previous coordinates.) See related comment in the ImageViewer component where the
         * selectNearestImagePoint command is consumed and acted upon.
         */
        setLoadedImagePoints(null);
        setCommand(commandTypes.selectNearestImagePoint);
        history.push("/bilde");
      }
    }
  };

  return (
    <React.Fragment>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <MagnifyingGlassIcon />
        </div>
        <InputBase
          placeholder="Søk etter vegreferanse, fylke eller stedsnavn"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />
      </div>
    </React.Fragment>
  );
};

const getCoordinates = async (vegsystemreferanse) => {
  const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
  if (vegResponse) {
    const wkt = vegResponse.data?.geometri?.wkt;
    return getCoordinatesFromWkt(wkt);
  }
};

const getCoordinatesFromWkt = (wkt) => {
  const split = wkt?.split(/[()]/);
  const coordinateString = split[1];
  if (!coordinateString) return null;
  const coordinates = coordinateString.split(" ");
  return {
    lat: parseFloat(coordinates[0]),
    lng: parseFloat(coordinates[1]),
  };
};

export default Search;
