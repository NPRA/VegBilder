import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';

import { InformIcon } from 'components/Icons/Icons';
import Theme from 'theme/Theme';

const useStyles = makeStyles((theme) => ({
  button: {
    marginTop: '0.25rem',
    backgroundColor: Theme.palette.common.grayDark,
    opacity: 0.9,
  },
  buttonDisabled: {
    marginTop: '0.25rem',
    backgroundColor: Theme.palette.common.grayDark,
    opacity: 0.7,
  },
}));

interface IMoreImageInfoButtonProps {
  setShowInformation: (value: boolean) => void;
  disabled: boolean;
}

const MoreImageInfoButton = ({ setShowInformation, disabled }: IMoreImageInfoButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title="Mer info om bildet">
      <IconButton
        disabled={disabled}
        aria-label="Mer info om bildet"
        className={disabled ? classes.buttonDisabled : classes.button}
        onClick={() => setShowInformation(true)}
      >
        <InformIcon />
      </IconButton>
    </Tooltip>
  );
};

export default MoreImageInfoButton;
