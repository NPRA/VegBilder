import { Tooltip, makeStyles, IconButton } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  backToMapButton: {
    border: 'none',
    backgroundColor: theme.palette.common.grayDark,
    zIndex: 1000,
    color: theme.palette.common.grayRegular,
    paddingLeft: '0.2rem',
    margin: '0.2rem',
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
  backToText: {
    alignSelf: 'center',
  },
}));

interface IBackToBigMapButton {
  setView: (view: string) => void;
}

const BackToBigMapButton = ({ setView }: IBackToBigMapButton) => {
  const classes = useStyles();
  return (
    <Tooltip title="Tilbake til hovedkart">
      <IconButton className={classes.backToMapButton} onClick={() => setView('map')}>
        {' '}
        <ArrowBack className={classes.arrowBack} />
      </IconButton>
    </Tooltip>
  );
};

export default BackToBigMapButton;
