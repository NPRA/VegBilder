import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    top: '0.3125rem',
    right: '0.3125rem',
  },
}));

interface ICloseButtonProps {
  onClick: () => void;
  transparent?: boolean;
  positionToTop?: string;
  position?:
    | 'inherit'
    | '-moz-initial'
    | 'initial'
    | 'revert'
    | 'unset'
    | 'fixed'
    | '-webkit-sticky'
    | 'absolute'
    | 'relative'
    | 'static'
    | 'sticky'
    | undefined;
}

const CloseButton = ({ onClick, transparent, positionToTop, position }: ICloseButtonProps) => {
  const classes = useStyles();
  return (
    <IconButton
      className={classes.closeButton}
      style={{
        background: transparent ? 'transparent' : '',
        top: positionToTop ?? '0.3125rem',
        position: position ? position : 'absolute',
      }}
      onClick={onClick}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
