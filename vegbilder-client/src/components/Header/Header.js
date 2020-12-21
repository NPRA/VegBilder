import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import { Toolbar, Grid, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import Search from 'components/Search/Search';
import YearSelector from 'components/YearSelector/YearSelector';
import ImageSeriesSelector from 'components/ImageSeriesSelector/ImageSeriesSelector';

const useStyles = makeStyles({
  headerAppBar: {
    height: '100%',
  },
  headerToolBar: {
    height: '100%',
    marginLeft: '4.125rem',
    marginRight: '4.125rem',
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
  },
  rightItem: {
    width: '7.5rem',
  },
});

const Header = ({ showMessage }) => {
  const classes = useStyles();

  return (
    <AppBar position="static" color="primary" elevation={3} className={classes.headerAppBar}>
      <Toolbar className={classes.headerToolBar} disableGutters>
        <Grid container direction="row" justify="space-between" alignItems="center">
          <Grid item className={classes.logoContainer}>
            <img src="images/svv-logo.svg" alt="Logo - Statens vegvesen" className={classes.logo} />
          </Grid>
          <Grid item className={classes.searchContainer}>
            <Search showMessage={showMessage} />
          </Grid>
          <Grid item className={classes.yearSelectorContainer}>
            <YearSelector />
            <Box width={'1.125rem'} />
            <ImageSeriesSelector />
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
