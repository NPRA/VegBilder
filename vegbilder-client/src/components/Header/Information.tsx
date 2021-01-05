import React from 'react';
import { makeStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

import CloseButton from 'components/CloseButton/CloseButton';
import { informationText } from 'constants/text';

const useStyles = makeStyles((theme) => ({
  information: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    width: '50rem',
    maxHeight: '70vh',
    overflowY: 'auto',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
  },
  content: {
    margin: '2rem',
  },
}));

interface IInformationProps {
  setVisible: () => void;
}

const Information = ({ setVisible }: IInformationProps) => {
  const classes = useStyles();

  return (
    <ClickAwayListener onClickAway={setVisible}>
      <div className={classes.information}>
        <CloseButton onClick={setVisible} />
        <div className={classes.content}>
          <p>{informationText.versionNumber}</p>
          <p>{informationText.contact}</p>
        </div>
      </div>
    </ClickAwayListener>
  );
};

export default Information;
