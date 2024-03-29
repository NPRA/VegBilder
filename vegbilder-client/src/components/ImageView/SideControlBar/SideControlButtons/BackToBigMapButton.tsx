import { Tooltip, makeStyles, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useTranslation } from "react-i18next";

const useStyles = makeStyles((theme) => ({
  backToMapButton: {
    pointerEvents: 'all',
    border: 'none',
    backgroundColor: theme.palette.common.grayDark,
    zIndex: 1000,
    color: theme.palette.common.grayRegular,
    paddingLeft: '0.2rem',
    margin: '0.2rem 0.2rem 0.35rem 0.2rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.grayRegular,
        },
      },
    },
  },
  arrowBack: {
    margin: '0 0.375rem 0 0',
    alignSelf: 'center',
  },
  buttonDisabled: {
    margin: '0.2rem 0.2rem 0.35rem 0.2rem',
    backgroundColor: theme.palette.common.grayDark,
    opacity: 0.7,
  },
}));

interface IBackToBigMapButton {
  setView: (view: string) => void;
  isZoomedInImage: boolean;
}

const BackToBigMapButton = ({ setView, isZoomedInImage }: IBackToBigMapButton) => {
  const classes = useStyles();
  const { t } = useTranslation('imageView', {keyPrefix: "sidebar"});

  const handleClick = () => {
    setView('map');
  };
  
  const tooltipTitle = t('back');

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton
        className={isZoomedInImage ? classes.buttonDisabled : classes.backToMapButton}
        onClick={handleClick}
        disabled={isZoomedInImage}
      >
        {' '}
        <ArrowBack className={classes.arrowBack} />
      </IconButton>
    </Tooltip>
  );
};

export default BackToBigMapButton;
