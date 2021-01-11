import React, { useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { MagnifyingGlassIcon } from '../Icons/Icons';
import { fade, makeStyles } from '@material-ui/core/styles';

import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import getVegByVegsystemreferanse from 'apis/NVDB/getVegByVegsystemreferanse';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { matchAndPadVegsystemreferanse } from 'utilities/vegsystemreferanseUtilities';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { getCoordinatesByPlace } from 'apis/geonorge/getCoordinatesByPlace';

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1.1, 1.1, 1.1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '50ch',
      height: '3ch',
    },
  },
}));

const Search = ({ showMessage }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCommand } = useCommand();

  const onChange = (event) => {
    setSearchString(event.target.value);
  };

  const onKeyDown = async (event) => {
    if (!event) return;

    if (event.key === 'Enter') {
      const validVegsystemReferanse = matchAndPadVegsystemreferanse(searchString);
      let latlng;
      let zoom;
      if (validVegsystemReferanse) {
        setSearchString(validVegsystemReferanse);
        latlng = await getCoordinates(validVegsystemReferanse);
        zoom = 16;
      } else {
        const place = await getCoordinatesByPlace(searchString);
        if (place.totaltAntallTreff !== '0') {
          console.log(place.stedsnavn);
          place.stedsnavn[0]
            ? (latlng = { lat: place.stedsnavn[0].nord, lng: place.stedsnavn[0].aust })
            : (latlng = { lat: place.stedsnavn.nord, lng: place.stedsnavn.aust });
          zoom = 14;
        } else {
          console.warn(`Invalid search query: ${searchString}`);
          showMessage(
            'Det der ser ikke ut som en vegsystemreferanse for ERF-veg eller et stedsnavn.'
          );
          return;
        }
      }

      if (latlng) {
        setCurrentCoordinates({ latlng: latlng, zoom: zoom });
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
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={searchString}
      />
    </div>
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
  const coordinates = coordinateString.split(' ');
  return {
    lat: parseFloat(coordinates[0]),
    lng: parseFloat(coordinates[1]),
  };
};

export default Search;
