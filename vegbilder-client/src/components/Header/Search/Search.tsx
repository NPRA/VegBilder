import React, { useEffect, useState, KeyboardEvent, useMemo } from 'react';
import InputBase from '@material-ui/core/InputBase';
import { makeStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import ListItemText from '@material-ui/core/ListItemText';
import { ClickAwayListener, ListSubheader } from '@material-ui/core';
import { debounce } from 'lodash';
import { useRecoilState, useSetRecoilState, useRecoilValue } from 'recoil';
import { useTranslation } from "react-i18next";

import getVegByVegsystemreferanse from 'apis/NVDB/getVegByVegsystemreferanse';
import { matchAndPadVegsystemreferanse } from 'utilities/vegsystemreferanseUtilities';
import { getStedsnavnByName } from 'apis/geonorge/getStedsnavnByName';
import { MagnifyingGlassIcon } from 'components/Icons/Icons';
import {
  imagePointQueryParameterState,
  latLngZoomQueryParameterState,
  loadedImagePointsFilterState,
} from 'recoil/selectors';
import useAsyncError from 'hooks/useAsyncError';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { currentYearState } from 'recoil/atoms';
import useFetchNearestLatestImagePoint from 'hooks/useFetchNearestLatestImagepoint';
import { getImagePointLatLng } from 'utilities/imagePointUtilities';
import { getCoordinatesFromWkt } from 'utilities/latlngUtilities';
import { ILatlng } from 'types';
import { IGeonorgeResponse, IStedsnavn, IVegsystemData } from './types';


const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.secondary.main,
  },
  search: {
    position: 'relative',
    alignItems: 'center',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: theme.palette.common.grayDark,
    minWidth: '44ch',
    maxWidth: '70ch',
    '&:hover': {
      backgroundColor: theme.palette.common.grayMedium,
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
    width: '90%',
  },
  inputInput: {
    padding: theme.spacing(1.1, 1.1, 1.1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      height: '3ch',
    },
  },
  menu: {
    position: 'absolute',
    marginTop: '1.35rem',
    left: 0,
    color: theme.palette.common.grayRegular,
    backgroundColor: theme.palette.common.grayDarker,
    borderRadius: '10px',
    width: '100%',
    border: `0.5px solid ${theme.palette.common.grayDark}`,
    maxHeight: '40rem',
    overflowY: 'auto',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
  button: {
    '&:hover': {
      color: theme.palette.common.orangeDark,
      backgroundColor: theme.palette.common.grayDark,
      '& span': {
        '& svg': {
          '& path': {
            stroke: theme.palette.common.orangeDark,
          },
          '& circle': {
            stroke: theme.palette.common.orangeDark,
          },
        },
      },
    },
  },
}));

interface ISearchProps {
  showMessage: (message: string) => void;
  setMapView: () => void;
}

const Search = ({ showMessage, setMapView }: ISearchProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['snackbar', 'common']);
  const [searchString, setSearchString] = useState('');
  const [stedsnavnOptions, setStedsnavnOptions] = useState<IStedsnavn[]>([]);
  const filteredStedsnavnOptions = stedsnavnOptions.filter((stedsnavn) => !(stedsnavn.kommuner === null)); //Nytt geonorge-api kan returnere steder utenfor Norge med kommune + fylke = null. Disse filtrerer vi derfor vekk.
  const [vegSystemReferanser, setVegSystemReferanser] = useState<IVegsystemData[]>([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [resetImagePoint, setResetImagePoint] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const setCurrentCoordinates = useSetRecoilState(latLngZoomQueryParameterState);
  const setLoadedImagePoints = useSetRecoilState(loadedImagePointsFilterState);
  const currentYear = useRecoilValue(currentYearState);
  const [, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);

  const throwError = useAsyncError();
  const fetchNearestImagePoint = useFetchNearestImagePoint(
    showMessage,
    t('snackbar:fetchMessage.error4')
  );

  const fetchNearestLatestImagePoint = useFetchNearestLatestImagePoint(
    showMessage,
    t('snackbar:fetchMessage.error5') 
  );


  const delayedStedsnavnQuery = useMemo(
    () =>
      debounce(async (trimmedSearch) => {
        const response = await getStedsnavnByName(trimmedSearch);
        if (response.status !== 200) {
          throwError(response);
          return;
        }
        const stedsnavn: IGeonorgeResponse = response.data;
        if (stedsnavn && stedsnavn.metadata.totaltAntallTreff !== 0) {
          stedsnavn.navn[0] ? 
          setStedsnavnOptions([...stedsnavn.navn]) :
          setStedsnavnOptions([]);
        }
      }, 300),
    [throwError]
  );

  const delayedVegQuery = useMemo(
    () =>
      debounce(async (vegsystemreferanse) => {
        const vegResponse = await getVegByVegsystemreferanse(vegsystemreferanse);
        if (vegResponse) {
          if (vegResponse.status !== 200) {
            throwError(vegResponse);
            return;
          }
          const vegsystemData = vegResponse.data;
          const newReferanceState = [vegsystemData, ...vegSystemReferanser];
          setVegSystemReferanser(newReferanceState);
        } else {
          showMessage(t('snackbar:fetchMessage.errorERF')); 
          setVegSystemReferanser([]);
        }
      }, 300),
    [showMessage, throwError, vegSystemReferanser]
  );

  useEffect(() => {
    if (resetImagePoint) {
      setCurrentImagePoint(null);
      setLoadedImagePoints(null);
    }
    return () => {
      setResetImagePoint(false);
    };
  }, [resetImagePoint, setCurrentImagePoint, setLoadedImagePoints]);

  const handleSelectedOption = (latlng: ILatlng | null, zoom: number) => {
    /* Select nearest image point close to coordinates of the place. If no image is found,
     * The user is brought back to the map.
     */
    setOpenMenu(false);
    setSelectedIndex(0);
    if (latlng && latlng.lat && latlng.lng) {
      setCurrentCoordinates({ ...latlng, zoom: zoom });
      setResetImagePoint(true);
      if (typeof currentYear === 'number') {
        fetchNearestImagePoint(latlng, currentYear).then((imagePoint) => {
          if (imagePoint) {
            const imagePointLatLng = getImagePointLatLng(imagePoint);
            if (imagePointLatLng) setCurrentCoordinates({ ...imagePointLatLng, zoom: zoom });
          } else {
            setMapView();
          }
        })
      } else {
        fetchNearestLatestImagePoint(latlng).then((imagePoint) => {
          if (!imagePoint) {
            setMapView();
          };
        })
      };
      setSearchString('');
    }
  };

  const handleVegSystemReferanseClick = async (wkt: string) => {
    const latlng = getCoordinatesFromWkt(wkt);
    const zoom = 16;
    handleSelectedOption(latlng, zoom);
  };

  const getZoomByTypeOfPlace = (stedsnavn: string) => {
    let zoom;
    switch (stedsnavn) {
      case 'Adressenavn':
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

  const handleSearch = async (event: React.ChangeEvent<{ value: string }>) => {
    if (event && event.target) {
      const search = event.target.value;
      const previousSearch = searchString;
      setSearchString(search);

      const isAlphaNumericSpace = /^[a-å0-9-. ]+$/i;
      if (isAlphaNumericSpace.test(search)) {
        const trimmedSearch = search.trim();
        if (trimmedSearch === searchString || trimmedSearch === previousSearch.trim()) return;

        const validVegsystemReferanse = matchAndPadVegsystemreferanse(trimmedSearch);
        if (validVegsystemReferanse) {
          const vegreferanser = vegSystemReferanser.map(
            (referaneData) => referaneData.vegsystemreferanse.kortform
          );
          if (!vegreferanser.includes(validVegsystemReferanse)) {
            await delayedVegQuery(validVegsystemReferanse);
          }
        } else {
          setVegSystemReferanser([]);
        }
        await delayedStedsnavnQuery(trimmedSearch);
        setOpenMenu(true);
      } else {
        setSelectedIndex(0);
      }
    }
  };

  const handleKeyboardEvents = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (vegSystemReferanser.length) {
        const referance = vegSystemReferanser[selectedIndex];
        if (referance) handleVegSystemReferanseClick(referance.geometri.wkt);
      }
      if (filteredStedsnavnOptions.length) {
        const stedsnavn = filteredStedsnavnOptions[selectedIndex];
        if (stedsnavn) {
          const zoom = getZoomByTypeOfPlace(stedsnavn.navneobjekttype);
          const latlng = { lat: stedsnavn.representasjonspunkt.nord, lng: stedsnavn.representasjonspunkt.øst };
          handleSelectedOption(latlng, zoom);
        }
      }
    }
    if (event.key === 'ArrowDown') {
      setSelectedIndex((prevState) => prevState + 1);
    }
    if (event.key === 'ArrowUp') {
      setSelectedIndex((prevState) => prevState - 1);
    }
  };

  const handleInputFieldFocus = () => {
    if (searchString.length && (vegSystemReferanser.length || filteredStedsnavnOptions.length)) {
      setOpenMenu(true);
      setSelectedIndex(0);
    }
  };

  // Enkelte fylker, f.eks. Troms of Finnmark, har flere navn (bla.a. på samisk) hvor alle navnene er satt sammen 
  // i en tekststreng av typen "navn - navn2 - navn3". Ettersom språket ellers er bokmål bruker vi bare dette for å få plass i nedtrekksmenyen.
  const formatFylkesnavn = (fylke: string) => {
    if (fylke.includes("-")) {
      return fylke.split("-")[0].trim();
    } else {
      return fylke;
    }
  }

  return (
    <ClickAwayListener onClickAway={() => setOpenMenu(false)}>
      <div className={classes.search}>
        <div className={classes.searchIcon}>
          <MagnifyingGlassIcon />
        </div>
        <InputBase
          placeholder={t('common:searchbar.placeholder')}
          classes={{
            root: classes.inputRoot,
            input: classes.inputInput,
          }}
          inputProps={{ 'aria-label': 'search' }}
          onChange={handleSearch}
          value={searchString}
          onKeyUp={handleKeyboardEvents}
          onFocus={handleInputFieldFocus}
        />
        {openMenu && (
          <div className={classes.menu} tabIndex={1}>
            {vegSystemReferanser.length > 0 && (
              <>
                <ListSubheader style={{ paddingTop: '0.5rem' }}>
                  {' '}
                  Vegsystemreferanser{' '}
                </ListSubheader>
                {vegSystemReferanser.map((referanse, i) => (
                  <MenuItem
                    selected={i === selectedIndex}
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
            {filteredStedsnavnOptions.length > 0 && (
              <>
                <ListSubheader style={{ paddingTop: '0.5rem' }}> Stedsnavn </ListSubheader>
                {filteredStedsnavnOptions.map((stedsnavn, i) => (
                  <MenuItem
                    key={i}
                    selected={i === selectedIndex}
                    style={{ paddingLeft: '1.875rem' }}
                    onClick={() => {
                      const zoom = getZoomByTypeOfPlace(stedsnavn.navneobjekttype);
                      const latlng = {
                        lat: stedsnavn.representasjonspunkt.nord,
                        lng: stedsnavn.representasjonspunkt.øst,
                      };
                      handleSelectedOption(latlng, zoom);
                    }}
                  >
                    <ListItemText
                      key={`Textkey${i}`}
                      primary={stedsnavn.skrivemåte}
                      secondary={`${stedsnavn.navneobjekttype}, ${stedsnavn.kommuner[0].kommunenavn} (${formatFylkesnavn(stedsnavn.fylker[0].fylkesnavn)})`}
                    />
                  </MenuItem>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default Search;
