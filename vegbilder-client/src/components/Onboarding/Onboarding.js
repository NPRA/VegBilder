import React, { useState } from 'react';
import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import PageInformation from 'components/PageInformation/PageInformation';

const useStyles = makeStyles((theme) => ({
  onboarding: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    width: '50rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.common.grayDark}`,
    borderRadius: '0.5rem',
  },
  formControl: {
    marginTop: 0,
    marginLeft: '1.35rem',
    marginBottom: '2rem',
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
        <PageInformation
          showMessage={showMessage}
          isOnboarding={true}
          setVisible={closeOnboarding}
        />
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
