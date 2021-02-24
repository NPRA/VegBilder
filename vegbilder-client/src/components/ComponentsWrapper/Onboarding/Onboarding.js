import React, { useState } from 'react';
import { Checkbox, FormControlLabel, makeStyles, Typography } from '@material-ui/core';

import PageInformationTextAndImage from 'components/ComponentsWrapper/Onboarding/PageInformationTextAndImage/PageInformationTextAndImage';
import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import { informationText } from 'constants/text';
import { DotsHorizontalSmallIcon } from 'components/Icons/Icons';

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
  paragraphs: {
    paddingBottom: '1rem',
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
    <PopUpWrapper setVisible={closeOnboarding}>
      <div className={classes.contentPadding}>
        <PageInformationTextAndImage />
        <div className={classes.paragraphs}>
          <Typography variant="body1">
            {' '}
            {informationText.text3} <DotsHorizontalSmallIcon />
            {' ".'}
          </Typography>
        </div>
        <FormControlLabel
          className={classes.formControl}
          control={<Checkbox className={classes.checkbox} onChange={handleStartupChange} />}
          label={'Ikke vis ved oppstart'}
        />
      </div>
    </PopUpWrapper>
  );
};

export default Onboarding;
