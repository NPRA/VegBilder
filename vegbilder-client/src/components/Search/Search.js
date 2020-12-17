import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import { MagnifyingGlassIcon } from "../Icons/Icons";
import { fade, makeStyles } from "@material-ui/core/styles";

import { useCurrentCoordinates } from "../../contexts/CurrentCoordinatesContext";
import { useLoadedImagePoints } from "../../contexts/LoadedImagePointsContext";
import { useCommand, commandTypes } from "../../contexts/CommandContext";
import getVegByVegsystemreferanse from "../../apis/NVDB/getVegByVegsystemreferanse";
import { useFilteredImagePoints } from "../../contexts/FilteredImagePointsContext";
import { matchAndPadVegsystemreferanse } from "../../utilities/vegsystemreferanseUtilities";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";

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

const Search = ({ showMessage }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState("");
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCommand } = useCommand();

  const onChange = (event) => {
    setSearchString(event.target.value);
  };

  const onKeyDown = async (event) => {
    if (event.key === "Enter") {
      const validSearchString = matchAndPadVegsystemreferanse(searchString);
      if (validSearchString == null) {
        console.warn(`Invalid search query: ${searchString}`);
        showMessage(
          "Det der ser ikke ut som en vegsystemreferanse for ERF-veg"
        );
        return;
      }
      setSearchString(validSearchString);
      const latlng = await getCoordinates(validSearchString);
      if (latlng) {
        setCurrentCoordinates({ latlng: latlng, zoom: 16 });
        /* Since a search usually entails a big jump in location, the currently loaded image points
         * will most likely no longer be useful. We need to clear them in order for the
         * selectNearestImagePointToCurrentCoordinates command to work. (Otherwise it will select
         * the nearest of the image points in the previous location.)
         */
        resetLoadedImagePoints();
        resetFilteredImagePoints();
        unsetCurrentImagePoint();
        setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
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
          placeholder="Søk etter vegsystemreferanse (ERF-veger)"
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ "aria-label": "search" }}
          onChange={onChange}
          onKeyDown={onKeyDown}
          value={searchString}
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
