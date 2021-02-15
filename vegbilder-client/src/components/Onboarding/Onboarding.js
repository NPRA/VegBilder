import React, { useState } from 'react';
import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import PageInformationTextAndImage from 'components/PageInformationTextAndImage/PageInformationTextAndImage';

const useStyles = makeStyles((theme) => ({
  onboarding: {
    position: 'absolute',
    zIndex: 100,
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    width: '100vh',
    maxHeight: '90vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.common.grayDark}`,
    borderRadius: '0.5rem',
    padding: '2rem',
    marginTop: '1rem',
  },
  formControl: {
    marginTop: 0,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: theme.palette.primary.contrastText,
  },
}));

const HIDE_SPLASH_ON_STARTUP = 'HideSplashOnStartup';

const Onboarding = (showMessage) => {
  const classes = useStyles();
  const hideWasSet = localStorage.getItem(HIDE_SPLASH_ON_STARTUP) === 'true';
  const [visible, setVisible] = useState(!hideWasSet);
  const [hideOnStartup, setHideOnStartup] = useState(hideWasSet);

  const closeOnboarding = () => setVisible(false);

  const handleStartupChange = () => {
    hideOnStartup
      ? localStorage.removeItem(HIDE_SPLASH_ON_STARTUP)
      : localStorage.setItem(HIDE_SPLASH_ON_STARTUP, 'true');
    setHideOnStartup(!hideOnStartup);
  };

  if (!visible) return null;
  return (
    <ClickAwayListener onClickAway={closeOnboarding}>
      <div className={classes.onboarding}>
        <PageInformationTextAndImage />
        <FormControlLabel
          className={classes.formControl}
          control={<Checkbox className={classes.checkbox} onChange={handleStartupChange} />}
          label={'Ikke vis ved oppstart'}
        />
      </div>
    </ClickAwayListener>
  );
};

export default Onboarding;
