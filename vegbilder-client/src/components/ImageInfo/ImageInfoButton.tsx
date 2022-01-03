import React from 'react';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useTranslation } from "react-i18next";

import { InformIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  button: {
    pointerEvents: 'all',
    backgroundColor: theme.palette.common.grayDark,
    margin: '0.2rem 0.2rem 0.35rem 0.2rem',
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
    margin: '0.2rem 0.2rem 0.35rem 0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.orangeDark,
        },
      },
    },
  },
  buttonDisabled: {
    margin: '0.2rem 0.2rem 0.35rem 0.2rem',
    backgroundColor: theme.palette.common.grayDark,
    opacity: 0.7,
  },
}));

interface IImageInfoButtonProps {
  setShowInformation: (value: boolean) => void;
  showInformation: boolean;
  disabled: boolean;
}

const ImageInfoButton = ({
  showInformation,
  setShowInformation,
  disabled,
}: IImageInfoButtonProps) => {
  const classes = useStyles();
  const { t } = useTranslation('dailyInfo', {keyPrefix: "buttons"});
  const tooltipMessage = showInformation ? t('hideInfo') :  t('moreInfo')
  
  return (
    <Tooltip title={tooltipMessage}> 
      <IconButton
        disabled={disabled}
        aria-label={t('moreInfo')}
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

export default ImageInfoButton;
