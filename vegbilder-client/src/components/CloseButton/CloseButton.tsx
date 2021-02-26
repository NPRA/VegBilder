import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    top: '0.3125rem',
    right: '0.3125rem',
    width: '1.875rem',
    height: '1.875rem',
    opacity: '80%',
  },
}));

interface ICloseButtonProps {
  onClick: () => void;
  transparent?: boolean;
  positionToTop?: string;
}

const CloseButton = ({ onClick, transparent, positionToTop }: ICloseButtonProps) => {
  const classes = useStyles();
  return (
    <IconButton
      className={classes.closeButton}
      style={{ background: transparent ? 'transparent' : '', top: positionToTop ?? '0.3125rem' }}
      onClick={onClick}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
