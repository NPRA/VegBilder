import { Tooltip, makeStyles, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { isHistoryModeState } from 'recoil/atoms';
import { imagePointQueryParameterState } from 'recoil/selectors';

const useStyles = makeStyles((theme) => ({
  backToMapButton: {
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

  const handleClick = () => {
    setView('map');
  };

  return (
    <Tooltip title="Tilbake til hovedkart">
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
