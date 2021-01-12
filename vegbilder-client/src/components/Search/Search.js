import React, { useCallback, useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ListSubheader } from '@material-ui/core';
import { debounce } from 'lodash';

import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useLoadedImagePoints } from 'contexts/LoadedImagePointsContext';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import getVegByVegsystemreferanse from 'apis/NVDB/getVegByVegsystemreferanse';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { matchAndPadVegsystemreferanse } from 'utilities/vegsystemreferanseUtilities';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { getStedsnavnByName } from 'apis/geonorge/getStedsnavnByName';
import { MagnifyingGlassIcon } from '../Icons/Icons';

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
    top: '5.2rem',
    left: 0,
    color: '#ececec',
    backgroundColor: '#2E3539',
    borderRadius: '0.5rem',
    width: '25rem',
    maxHeight: '40rem',
    overflowY: 'auto',
  },
}));

const Search = ({ showMessage }) => {
  const classes = useStyles();
  const [searchString, setSearchString] = useState('');
  const [stedsnavnOptions, setStedsnavnOptions] = useState([]);
  const [vegSystemReferanser, setVegSystemReferanser] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);

  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCommand } = useCommand();

  const delayedStedsnavnQuery = useCallback(
    debounce(async (trimmedSearch) => {
      const stedsnavn = await getStedsnavnByName(trimmedSearch);
      if (stedsnavn && stedsnavn.totaltAntallTreff !== '0') {
        const newOptions = stedsnavn.stedsnavn[0] ? [...stedsnavn.stedsnavn] : stedsnavn.stedsnavn;
        setStedsnavnOptions(newOptions);
      } else {
        setStedsnavnOptions([]);
        showMessage('Finner ingen steder med det navnet.');
      }
    }, 200),
    []
  );

  const delayedVegQuery = useCallback(
    debounce(async (vegsystemreferanse) => {
      const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
      if (vegResponse) {
        const vegsystemReferanse = vegResponse.data?.vegsystemreferanse.kortform;
        const newReferanceState = [vegsystemReferanse, ...vegSystemReferanser];
        setVegSystemReferanser(newReferanceState);
      } else {
        showMessage('Ugyldig ERF-veg');
        setVegSystemReferanser([]);
      }
    }, 300),
    []
  );

  const handleSelectedOption = (latlng, zoom) => {
    setOpenMenu(false);
    if (latlng && latlng.lat && latlng.lng) {
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
      setSearchString('');
    }
  };

  const handleVegSystemReferanseClick = async (vegsystemReferanse) => {
    const latlng = await getCoordinates(vegsystemReferanse);
    const zoom = 16;
    handleSelectedOption(latlng, zoom);
  };

  const onChange = async (event) => {
    if (event) {
      const search = event.target.value;
      const previousSearch = searchString;
      setSearchString(search);
      const isAlphaNumericSpace = /^[a-å0-9-. ]+$/i;
      if (isAlphaNumericSpace.test(search)) {
        const trimmedSearch = search.trim();
        if (trimmedSearch === searchString || trimmedSearch === previousSearch.trim()) return;

        const validVegsystemReferanse = matchAndPadVegsystemreferanse(trimmedSearch);
        if (validVegsystemReferanse) {
          if (!vegSystemReferanser.includes(validVegsystemReferanse)) {
            await delayedVegQuery(validVegsystemReferanse);
          }
        } else {
          setVegSystemReferanser([]);
          await delayedStedsnavnQuery(trimmedSearch);
        }
        setOpenMenu(true);
      } else {
        setOpenMenu(false);
      }
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <MagnifyingGlassIcon />
      </div>
      <InputBase
        placeholder="Søk etter et sted eller en vegsystemreferanse (ERF-veger)"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
        value={searchString}
      />
      {openMenu && (
        <div className={classes.menu}>
          {vegSystemReferanser.length > 0 && (
            <>
              <ListSubheader style={{ paddingTop: '0.5rem' }}> Vegsystemreferanser </ListSubheader>
              {vegSystemReferanser.map((referanse, i) => (
                <MenuItem
                  key={i}
                  style={{ paddingLeft: '1.875rem' }}
                  onClick={() => {
                    handleVegSystemReferanseClick(referanse);
                  }}
                >
                  <ListItemText key={`Textkey${i}`} primary={referanse} />
                </MenuItem>
              ))}
            </>
          )}
          {stedsnavnOptions && (
            <ListSubheader style={{ paddingTop: '0.5rem' }}> Stedsnavn </ListSubheader>
          )}
          {stedsnavnOptions.map((stedsnavn, i) => (
            <MenuItem
              key={i}
              style={{ paddingLeft: '1.875rem' }}
              onClick={() => {
                handleSelectedOption({ lat: stedsnavn.nord, lng: stedsnavn.aust }, 14);
              }}
            >
              <ListItemText
                key={`Textkey${i}`}
                primary={stedsnavn.stedsnavn}
                secondary={`${stedsnavn.navnetype}, ${stedsnavn.kommunenavn} (${stedsnavn.fylkesnavn})`}
              />
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
