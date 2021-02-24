import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Grid, Box, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Search from 'components/Search/Search';
import YearSelector from 'components/YearSelector/YearSelector';
import ImageSeriesSelector from 'components/ImageSeriesSelector/ImageSeriesSelector';
import { CircledHelpIcon } from 'components/Icons/Icons';
import PageInformation from './PageInformation/PageInformation';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { DEFAULT_COORDINATES, DEFAULT_ZOOM } from 'constants/defaultParamters';

const useStyles = makeStyles({
  headerAppBar: {
    minHeight: '4.375rem',
  },
  headerToolBar: {
    height: '100%',
    marginRight: '1.125rem',
    minHeight: '4.375rem',
  },
  logoContainer: {
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'flex-start',
  },
  yearSelectorContainer: {
    display: 'flex',
    flex: '1 1 auto',
    justifyContent: 'flex-start',
  },
  searchContainer: {
    marginLeft: '1.125rem',
    marginRight: '1.125rem',
  },
  logo: {
    width: '7.5rem',
    cursor: 'pointer',
    marginLeft: '0.5rem',
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
}

const Header = ({ showMessage, setMapView }: IHeaderProps) => {
  const classes = useStyles();
  const [showInformation, setShowInformation] = useState(false);
  const { setCurrentCoordinates } = useCurrentCoordinates();
  const { unsetCurrentImagePoint } = useCurrentImagePoint();

  const resetToDefaultStates = () => {
    setCurrentCoordinates({ latlng: DEFAULT_COORDINATES, zoom: DEFAULT_ZOOM });
    unsetCurrentImagePoint();
    setMapView();
  };

  return (
    <AppBar position="static" color="primary" elevation={3} className={classes.headerAppBar}>
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
            <Search showMessage={showMessage} />
          </Grid>
          <Grid item className={classes.yearSelectorContainer}>
            <YearSelector />
            <Box width={'1.125rem'} />
            <ImageSeriesSelector />
          </Grid>
          <Tooltip title="Informasjon om Vegbilder">
            <IconButton
              aria-label="Informasjon om Vegbilder"
              className={classes.button}
              onClick={() => setShowInformation(!showInformation)}
            >
              <CircledHelpIcon />
            </IconButton>
          </Tooltip>
        </Grid>
      </Toolbar>
      {showInformation && (
        <PageInformation setVisible={() => setShowInformation(!showInformation)} />
      )}
    </AppBar>
  );
};

export default Header;
