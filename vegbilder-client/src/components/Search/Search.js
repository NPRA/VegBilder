import React, { useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "@material-ui/icons/Search";
import { fade, makeStyles } from "@material-ui/core/styles";

import CurrentLocationContext from "../../contexts/CurrentLocationContext";
import getVegByVegsystemreferanse from "../../apis/NVDB/getVegByVegsystemreferanse";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  search: {
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(1),
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
    padding: theme.spacing(1, 1, 1, 0),
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
  const [searchString, setSearchString] = useState("");

  const handleChange = (event) => {
    setSearchString(event.target.value);
  };

  const onKeyDown = async (event, setCurrentLocation) => {
    if (event.key === "Enter") {
      console.log(`Searching for ${searchString}`);
      const latlng = await getCoordinates(searchString);
      console.log(latlng);
      if (latlng) {
        setCurrentLocation({ latlng: latlng, zoom: 16 });
      }
    }
  };

  const renderSearchField = (setCurrentLocation) => {
    return (
      <React.Fragment>
        <div className={classes.search}>
          <div className={classes.searchIcon}>
            <SearchIcon />
          </div>
          <InputBase
            placeholder="Søk etter vegreferanse, fylke eller stedsnavn"
            classes={{
              root: classes.inputRoot,
              input: classes.inputInput,
            }}
            inputProps={{ "aria-label": "search" }}
            onChange={handleChange}
            onKeyDown={(event) => onKeyDown(event, setCurrentLocation)}
          />
        </div>
      </React.Fragment>
    );
  };

  return (
    <CurrentLocationContext.Consumer>
      {({ setCurrentLocation }) => renderSearchField(setCurrentLocation)}
    </CurrentLocationContext.Consumer>
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
