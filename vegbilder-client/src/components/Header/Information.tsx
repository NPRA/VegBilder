import React from 'react';
import { makeStyles, Paper, Typography } from '@material-ui/core';

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
    zIndex: 100,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.common.grayDark}`,
    borderRadius: '0.5rem',
  },
  content: {
    margin: '2rem 2rem 0 2rem',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
}));

interface IInformationProps {
  setVisible: () => void;
  isOnboarding?: boolean;
}

const Information = ({ setVisible, isOnboarding }: IInformationProps) => {
  const classes = useStyles(isOnboarding);

  return (
    <div className={isOnboarding ? '' : classes.information}>
      <CloseButton transparent={true} onClick={setVisible} />
      <div className={classes.content}>
        <Typography variant="h2" className={classes.paragraphs}>
          {' '}
          {informationText.header}{' '}
        </Typography>
        <Typography variant="body1" className={classes.paragraphs}>
          {' '}
          {informationText.text}{' '}
        </Typography>
        <Typography variant="body1" className={classes.paragraphs}>
          {informationText.contact}
        </Typography>
        <Typography variant="body1" className={classes.paragraphs}>
          {informationText.versionNumber}
        </Typography>
      </div>
    </div>
  );
};

export default Information;
