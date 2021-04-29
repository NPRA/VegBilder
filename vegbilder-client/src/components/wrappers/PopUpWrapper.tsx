import React from 'react';
import { makeStyles } from '@material-ui/core';

import CloseButton from 'components/CloseButton/CloseButton';

const useStyles = makeStyles((theme) => ({
  popupWrapper: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    width: '60%',
    maxHeight: '95vh',
    overflowY: 'auto',
    zIndex: 100000,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    borderRadius: '10px',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    padding: '0.2rem',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
}));

interface IInformationProps {
  setVisible: () => void;
  children?: JSX.Element | JSX.Element[];
}

const PopUpWrapper = ({ setVisible, children }: IInformationProps) => {
  const classes = useStyles();

  return (
    <div className={classes.popupWrapper}>
      <CloseButton transparent={true} onClick={setVisible} />
      {children}
    </div>
  );
};

export default PopUpWrapper;
