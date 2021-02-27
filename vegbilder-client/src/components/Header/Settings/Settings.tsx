import { IconButton, makeStyles, Popover, Tooltip, Typography } from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useState } from 'react';

import CheckBox from 'components/CheckBox/CheckBox';
import { settingsText } from 'constants/text';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: '17rem',
    padding: '1rem',
    marginTop: '2rem',
    border: `1px solid ${theme.palette.common.grayDark}`,
  },
  button: {
    background: 'transparent',
  },
  header: {
    paddingBottom: '1rem',
  },
}));

const Settings = () => {
  const classes = useStyles();

  const [settingsAnchorEl, setSettingsAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [isChecked, setIsCheked] = useState(
    localStorage.getItem('HideSplashOnStartup') === 'false'
  );

  const handleSettingsButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setSettingsAnchorEl(event.currentTarget);
  };

  const handleSettingsClose = () => {
    setSettingsAnchorEl(null);
  };

  const handleShowOnboarding = () => {
    const showOnBoarding = localStorage.getItem('HideSplashOnStartup');
    if (showOnBoarding === 'true') {
      localStorage.setItem('HideSplashOnStartup', 'false');
      setIsCheked(true);
    } else {
      localStorage.setItem('HideSplashOnStartup', 'true');
      setIsCheked(false);
    }
  };

  return (
    <>
      <Tooltip title="Innstillinger">
        <IconButton
          aria-label="Innstillinger"
          className={classes.button}
          onClick={handleSettingsButtonClick}
        >
          <SettingsIcon />
        </IconButton>
      </Tooltip>
      <Popover
        id={Boolean(settingsAnchorEl) ? 'settings' : undefined}
        open={Boolean(settingsAnchorEl)}
        anchorEl={settingsAnchorEl}
        onClose={handleSettingsClose}
        PaperProps={{ classes: { root: classes.popover } }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Typography variant="h3" className={classes.header}>
          {' '}
          {settingsText.header}{' '}
        </Typography>
        <CheckBox
          handleChange={handleShowOnboarding}
          label={'Vis oppstartsmelding'}
          checked={isChecked}
        />
      </Popover>
    </>
  );
};

export default Settings;
