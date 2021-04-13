import { makeStyles, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';

import Theme from 'theme/Theme';

const useStyles = makeStyles(() => ({
  backToMapButton: {
    border: 'none',
    position: 'absolute',
    top: '1rem',
    left: '0.5rem',
    backgroundColor: Theme.palette.common.grayDarker,
    zIndex: 1000,
    padding: '0 1rem',
    minHeight: '2rem',
    color: Theme.palette.common.grayMenuItems,
    textAlign: 'center',
    borderRadius: '10px',
    display: 'flex',
    cursor: 'pointer',
    opacity: 0.9,
    '&:hover': {
      color: Theme.palette.common.orangeDark,
      backgroundColor: Theme.palette.common.grayDark,
      opacity: 'revert',
      '& span': {
        '& svg': {
          '& path': {
            fill: Theme.palette.common.orangeDark,
          },
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
    <button className={classes.backToMapButton} onClick={() => setView('map')}>
      {' '}
      <ArrowBack className={classes.arrowBack} />
      <Typography variant="body1" className={classes.backToText}>
        {' '}
        Tilbake til stort kart{' '}
      </Typography>{' '}
    </button>
  );
};

export default BackToBigMapButton;
