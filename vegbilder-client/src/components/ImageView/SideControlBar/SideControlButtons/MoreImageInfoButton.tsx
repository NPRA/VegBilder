import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';

import { InformIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  button: {
    backgroundColor: theme.palette.common.grayDark,
    margin: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.grayRegular,
        },
      },
    },
  },
  active: {
    backgroundColor: theme.palette.common.grayDark,
    margin: '0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.orangeDark,
        },
      },
    },
  },
  buttonDisabled: {
    margin: '0.2rem',
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
    <Tooltip title={showInformation ? 'Skjul informasjon' : 'Mer informasjon'}>
      <IconButton
        disabled={disabled}
        aria-label="Mer informasjon"
        className={
          disabled ? classes.buttonDisabled : showInformation ? classes.active : classes.button
        }
        style={showInformation ? { background: 'none' } : {}}
        onClick={() => setShowInformation(!showInformation)}
      >
        <InformIcon />
      </IconButton>
    </Tooltip>
  );
};

export default MoreImageInfoButton;
