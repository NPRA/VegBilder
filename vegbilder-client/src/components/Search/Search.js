import React, { useRef, useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { MagnifyingGlassIcon } from '../Icons/Icons';
import { fade, makeStyles } from '@material-ui/core/styles';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';

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
  menu: {
    position: 'absolute',
    top: '5.5rem',
    left: 0,
    color: '#ececec',
    backgroundColor: '#2E3539',
    borderRadius: '0.5rem',
    width: '20rem',
    maxHeight: '20rem',
    overflowY: 'auto',
  },
}));

const Search = ({ showMessage }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');
  const [options, setOptions] = useState([]);
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCommand } = useCommand();

  const menuRef = useRef();

  const [openMenu, setOpenMenu] = useState(false);

  const [searchOptionsAnchorEl, setSearchOptionsAnchorEl] = useState(null);

  const handleSelectedOption = (place) => {
    setOpenMenu(false);
    const latlng = { lat: place.nord, lng: place.aust };
    if (latlng.lat && latlng.lng) {
      setCurrentCoordinates({ latlng: latlng, zoom: 12 });
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
  };

  const handleCloseMenu = () => {
    setOpenMenu(false);
  };

  const onChange = async (event) => {
    if (event.target.value) {
      setSearchString(event.target.value);

      const validVegsystemReferanse = matchAndPadVegsystemreferanse(searchString);
      if (validVegsystemReferanse) {
        setSearchString(validVegsystemReferanse);
        const latlng = await getCoordinates(validVegsystemReferanse);
        const zoom = 16;
      } else {
        const place = await getCoordinatesByPlace(event.target.value);
        if (place.totaltAntallTreff !== '0') {
          const newOptions = place.stedsnavn[0] ? [...place.stedsnavn] : place.stedsnavn;
          setOptions(newOptions);
          const zoom = 14;
        } else {
          // console.warn(`Invalid search query: ${searchString}`);
          // showMessage('Ugyldig vegsystemreferanse for ERF-veg eller stedsnavn.');
          // return;
        }
      }
    }
    //setSearchOptionsAnchorEl(menuRef.current);
    setOpenMenu(true);
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
        value={searchString}
      />
      {/* <p className={classes.speedHeading}> Hastighet </p> */}
      {openMenu && (
        <div className={classes.menu}>
          {options.map((option, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                handleSelectedOption(option);
                handleCloseMenu();
              }}
            >
              <ListItemText key={`Textkey${i}`} primary={option?.stedsnavn} />
            </MenuItem>
          ))}
        </div>
      )}
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
