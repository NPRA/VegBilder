import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';

import { InformIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.common.grayDarker,
    marginLeft: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.grayRegular,
        },
      },
    },
  },
  buttonDisabled: {
    marginLeft: '0.2rem',
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
    <Tooltip title="Mer info om bildet">
      <IconButton
        disabled={disabled}
        aria-label="Mer info om bildet"
        className={disabled ? classes.buttonDisabled : classes.button}
        onClick={() => setShowInformation(!showInformation)}
      >
        <InformIcon />
      </IconButton>
    </Tooltip>
  );
};

export default MoreImageInfoButton;
