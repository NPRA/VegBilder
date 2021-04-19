import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';

import { InformIcon, InformOffIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.common.grayDarker,
    opacity: 0.7,
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.grayRegular,
        },
      },
    },
  },
  buttonDisabled: {
    marginTop: '0.25rem',
    backgroundColor: theme.palette.common.grayDark,
    opacity: 0.7,
  },
}));

interface IMoreImageInfoButtonProps {
  setShowInformation: (value: boolean) => void;
  showInformation: boolean;
  disabled: boolean;
}

const MoreImageInfoButton = ({
  showInformation,
  setShowInformation,
  disabled,
}: IMoreImageInfoButtonProps) => {
  const classes = useStyles();

  return (
    <Tooltip title={showInformation ? 'Skjul info' : 'Mer info om bildet'}>
      <IconButton
        disabled={disabled}
        aria-label="Mer info om bildet"
        className={disabled ? classes.buttonDisabled : classes.button}
        onClick={() => setShowInformation(!showInformation)}
      >
        {showInformation ? <InformIcon /> : <InformOffIcon />}
      </IconButton>
    </Tooltip>
  );
};

export default MoreImageInfoButton;
