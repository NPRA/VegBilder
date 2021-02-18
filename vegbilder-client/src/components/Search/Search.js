import React, { useCallback, useEffect, useState } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { fade, makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ClickAwayListener, ListSubheader } from '@material-ui/core';
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
    marginTop: '1.35rem',
    left: 0,
    color: theme.palette.common.grayRegular,
    backgroundColor: theme.palette.common.grayDarker,
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
  const [resetImagePoint, setResetImagePoint] = useState(false);
  const [findClosestImagePoint, setFindClosestImagePoint] = useState(false);

  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCommand } = useCommand();

  const delayedStedsnavnQuery = useCallback(
    debounce(async (trimmedSearch) => {
      const stedsnavn = await getStedsnavnByName(trimmedSearch);
      if (stedsnavn && stedsnavn.totaltAntallTreff !== '0') {
        const newOptions = stedsnavn.stedsnavn[0]
          ? [...stedsnavn.stedsnavn]
          : [stedsnavn.stedsnavn];
        setStedsnavnOptions(newOptions);
      } else {
        setStedsnavnOptions([]);
      }
    }, 300),
    []
  );

  const delayedVegQuery = useCallback(
    debounce(async (vegsystemreferanse) => {
      const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
      if (vegResponse) {
        const vegsystemData = vegResponse.data;
        const newReferanceState = [vegsystemData, ...vegSystemReferanser];
        setVegSystemReferanser(newReferanceState);
      } else {
        showMessage('Ugyldig ERF-veg');
        setVegSystemReferanser([]);
      }
    }, 300),
    []
  );

  useEffect(() => {
    if (resetImagePoint) {
      unsetCurrentImagePoint();
      resetLoadedImagePoints();
      resetFilteredImagePoints();
    }
    return () => {
      setResetImagePoint(false);
    };
  }, [resetImagePoint, resetFilteredImagePoints, resetLoadedImagePoints, unsetCurrentImagePoint]);

  useEffect(() => {
    if (findClosestImagePoint) {
      setCommand(commandTypes.selectNearestImagePointToCurrentCoordinates);
    }
    return () => {
      setFindClosestImagePoint(false);
    };
  }, [findClosestImagePoint, setCommand]);

  const handleSelectedOption = (latlng, zoom) => {
    /* Since a search usually entails a big jump in location, the currently loaded image points
     * will most likely no longer be useful. We need to clear them in order for the
     * selectNearestImagePointToCurrentCoordinates command to work. (Otherwise it will select
     * the nearest of the image points in the previous location.)
     */
    setOpenMenu(false);
    if (latlng && latlng.lat && latlng.lng) {
      setCurrentCoordinates({ latlng: latlng, zoom: zoom });
      setResetImagePoint(true);
      if (zoom === 16) {
        setFindClosestImagePoint(true);
      }
      setSearchString('');
    }
  };

  const handleVegSystemReferanseClick = async (wkt) => {
    const latlng = await getCoordinatesFromWkt(wkt);
    const zoom = 16;
    handleSelectedOption(latlng, zoom);
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

  const getZoomByTypeOfPlace = (stedsnavn) => {
    let zoom;
    switch (stedsnavn) {
      case 'Adressenavn (veg/gate)':
        zoom = 16;
        break;
      case 'Fjellområde':
        zoom = 12;
        break;
      default:
        zoom = 15;
    }
    return zoom;
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
        }
        await delayedStedsnavnQuery(trimmedSearch);
        setOpenMenu(true);
      } else {
        setOpenMenu(false);
      }
    }
  };

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      if (vegSystemReferanser.length) {
        handleVegSystemReferanseClick(vegSystemReferanser[0].geometri.wkt);
      }
      if (stedsnavnOptions.length) {
        const stedsnavn = stedsnavnOptions[0];
        const zoom = getZoomByTypeOfPlace(stedsnavn.navnetype);
        handleSelectedOption({ lat: stedsnavn.nord, lng: stedsnavn.aust }, zoom);
      }
    }
  };

  const onFocus = () => {
    if (vegSystemReferanser.length || stedsnavnOptions.length) {
      setOpenMenu(true);
    }
  };

  return (
    <div className={classes.search}>
      <div className={classes.searchIcon}>
        <MagnifyingGlassIcon />
      </div>
      <InputBase
        placeholder="Søk etter sted eller vegsystemreferanse (ERF-veger)"
        classes={{
          root: classes.inputRoot,
          input: classes.inputInput,
        }}
        inputProps={{ 'aria-label': 'search' }}
        onChange={onChange}
        value={searchString}
        onKeyUp={onKeyUp}
        onFocus={onFocus}
      />
      {openMenu && (
        <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
          <div className={classes.menu} tabIndex="1">
            {vegSystemReferanser.length > 0 && (
              <>
                <ListSubheader style={{ paddingTop: '0.5rem' }}>
                  {' '}
                  Vegsystemreferanser{' '}
                </ListSubheader>
                {vegSystemReferanser.map((referanse, i) => (
                  <MenuItem
                    selected={i === 0}
                    key={i}
                    style={{ paddingLeft: '1.875rem' }}
                    onClick={() => {
                      handleVegSystemReferanseClick(referanse.geometri.wkt);
                    }}
                  >
                    <ListItemText
                      key={`Textkey${i}`}
                      primary={referanse.vegsystemreferanse.kortform}
                    />
                  </MenuItem>
                ))}
              </>
            )}
            {stedsnavnOptions.length > 0 && (
              <>
                <ListSubheader style={{ paddingTop: '0.5rem' }}> Stedsnavn </ListSubheader>
                {stedsnavnOptions.map((stedsnavn, i) => (
                  <MenuItem
                    key={i}
                    selected={i === 0}
                    style={{ paddingLeft: '1.875rem' }}
                    onClick={() => {
                      const zoom = getZoomByTypeOfPlace(stedsnavn.navnetype);
                      handleSelectedOption({ lat: stedsnavn.nord, lng: stedsnavn.aust }, zoom);
                    }}
                  >
                    <ListItemText
                      key={`Textkey${i}`}
                      primary={stedsnavn.stedsnavn}
                      secondary={`${stedsnavn.navnetype}, ${stedsnavn.kommunenavn} (${stedsnavn.fylkesnavn})`}
                    />
                  </MenuItem>
                ))}
              </>
            )}
          </div>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default Search;
