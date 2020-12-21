import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: 'absolute',
    top: '0.3125rem',
    right: '0.3125rem',
    width: '1.875rem',
    height: '1.875rem',
    opacity: '80%',
  },
}));

const CloseButton = ({ onClick }) => {
  const classes = useStyles();
  return (
    <IconButton className={classes.closeButton} onClick={onClick}>
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
