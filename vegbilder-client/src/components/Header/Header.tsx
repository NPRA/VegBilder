import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Grid, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useRecoilState } from 'recoil';
import { useTranslation } from "react-i18next";

import Search from './Search/Search';
import YearSelector from './YearSelector/YearSelector';
import { CircledHelpIcon } from 'components/Icons/Icons';
import { DEFAULT_COORDINATES, DEFAULT_ZOOM } from 'constants/defaultParamters';
import { imagePointQueryParameterState, latLngZoomQueryParameterState, vegsystemreferanseState } from 'recoil/selectors';

const useStyles = makeStyles({
  headerToolBar: {
    height: '100%',
    marginRight: '1.125rem',
    minHeight: '4.375rem',
  },
  logoContainer: {
    flex: '1 1 auto',
  },
  dateAndYearSelectorContainer: {
    display: 'flex',
    flex: '1 1 auto',
  },
  searchContainer: {
    marginRight: '1.125rem',
    width: '50%',
    maxWidth: '30rem',
  },
  logo: {
    width: '7.5rem',
    cursor: 'pointer',
    margin: '0.75rem',
  },
  rightItem: {
    width: '7.5rem',
  },
  button: {
    backgroundColor: 'transparent',
  },
});

interface IHeaderProps {
  showMessage: (message: string) => void;
  setMapView: () => void;
  setShowInformation: (val: boolean) => void;
  showInformation: boolean;
}

const Header = ({ showMessage, setMapView, showInformation, setShowInformation }: IHeaderProps) => {
  const classes = useStyles();
  const { t } = useTranslation('common');
  const [, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [, setCurrentVegsystemreferanse] = useRecoilState(vegsystemreferanseState);

  const tooltipTitle: string = t('pageInfo');

  const resetToDefaultStates = () => {
    setCurrentImagePoint(null);
    setCurrentVegsystemreferanse(null);
    setMapView();
    setCurrentCoordinates({ ...DEFAULT_COORDINATES, zoom: DEFAULT_ZOOM });
  };

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar className={classes.headerToolBar} disableGutters>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item className={classes.logoContainer}>
            <img
              src="images/svv-logo.svg"
              alt="Logo - Statens vegvesen"
              className={classes.logo}
              onClick={() => resetToDefaultStates()}
            />
          </Grid>
          <Grid item className={classes.searchContainer}>
            <Search showMessage={showMessage} setMapView={setMapView} />
          </Grid>
          <Grid item className={classes.dateAndYearSelectorContainer}>
            <YearSelector showMessage={showMessage} />
          </Grid>
          <Tooltip title={tooltipTitle}> 
            <IconButton
              aria-label={tooltipTitle}
              className={classes.button}
              onClick={() => setShowInformation(!showInformation)}
            >
              <CircledHelpIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
