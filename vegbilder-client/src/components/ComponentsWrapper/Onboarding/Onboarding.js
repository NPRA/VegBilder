import React, { useState } from 'react';
import { Checkbox, FormControlLabel, makeStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import PageInformationTextAndImage from 'components/PageInformationTextAndImage/PageInformationTextAndImage';
import PopUpWrapper from 'components/wrappers/PopUpWrapper';

const useStyles = makeStyles((theme) => ({
  contentPadding: {
    padding: '2rem',
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

const Onboarding = () => {
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
      <PopUpWrapper setVisible={closeOnboarding}>
        <div className={classes.contentPadding}>
          <PageInformationTextAndImage />
          <FormControlLabel
            className={classes.formControl}
            control={<Checkbox className={classes.checkbox} onChange={handleStartupChange} />}
            label={'Ikke vis ved oppstart'}
          />
        </div>
      </PopUpWrapper>
    </ClickAwayListener>
  );
};

export default Onboarding;
