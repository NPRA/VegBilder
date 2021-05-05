import { makeStyles, Typography } from '@material-ui/core';
import React from 'react';
import Theme from 'theme/Theme';

const useStyles = makeStyles({
  mobile: {
    backgroundColor: Theme.palette.common.grayDarker,
    color: Theme.palette.common.grayRegular,
    height: '100%',
    padding: '3rem 1rem',
    display: 'flex',
    flexDirection: 'column',
  },
  logo: {
    width: '7rem',
    alignSelf: 'center',
  },
});

const MobileLandingPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.mobile}>
      <img src="images/svv-logo.svg" alt="Logo - Statens vegvesen" className={classes.logo} />
      <Typography variant="h6" style={{ marginTop: '2rem' }}>
        {' '}
        VEGBILDER fungerer best på stor skjerm, besøk oss på PC eller nettbrett 😊
      </Typography>
    </div>
  );
};

export default MobileLandingPage;
