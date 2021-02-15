import React from 'react';
import { makeStyles } from '@material-ui/core';

import CloseButton from 'components/CloseButton/CloseButton';

const useStyles = makeStyles((theme) => ({
  information: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    minWidth: '50rem',
    maxHeight: '98vh',
    overflowY: 'auto',
    zIndex: 10000,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.common.grayDark}`,
    borderRadius: '0.5rem',
    padding: '0.2rem',
    marginTop: '1rem',
  },
}));

interface IInformationProps {
  setVisible: () => void;
  children?: JSX.Element | JSX.Element[];
}

const PopUpWrapper = ({ setVisible, children }: IInformationProps) => {
  const classes = useStyles();

  return (
    <div className={classes.information}>
      <CloseButton transparent={true} onClick={setVisible} />
      {children}
    </div>
  );
};

export default PopUpWrapper;
