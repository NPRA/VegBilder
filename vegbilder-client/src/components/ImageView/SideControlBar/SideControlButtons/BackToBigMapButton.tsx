import { makeStyles, Typography } from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  backToMapButton: {
    border: 'none',
    backgroundColor: theme.palette.common.grayDarker,
    zIndex: 1000,
    width: '11.5rem',
    padding: '0 0.5rem',
    minHeight: '2rem',
    color: theme.palette.common.grayRegular,
    textAlign: 'center',
    textTransform: 'uppercase',
    borderRadius: '10px',
    display: 'flex',
    cursor: 'pointer',
    opacity: 0.7,
    '&:hover': {
      color: theme.palette.common.orangeDark,
      backgroundColor: theme.palette.common.grayDark,
      opacity: 'revert',
      '& span': {
        '& svg': {
          '& path': {
            fill: theme.palette.common.orangeDark,
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
      <Typography variant="subtitle1" className={classes.backToText}>
        {' '}
        Tilbake til kart{' '}
      </Typography>{' '}
    </button>
  );
};

export default BackToBigMapButton;
