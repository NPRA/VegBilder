import React from 'react';
import { IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import Theme from 'theme/Theme';

const useStyles = makeStyles(() => ({
  closeButton: {
    position: 'absolute',
    top: '0.3125rem',
    right: '0.3125rem',
    zIndex: 'auto',
  },
}));

interface ICloseButtonProps {
  onClick: () => void;
  transparent?: boolean;
  positionToTop?: string;
  positionToRight?: string;
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
  zIndex?: number;
}

const CloseButton = ({ onClick, transparent, positionToTop, positionToRight: positionRight, position, zIndex }: ICloseButtonProps) => {
  const classes = useStyles();
  return (
    <IconButton
      className={classes.closeButton}
      style={{
        background: transparent ? 'transparent' : `${Theme.palette.common.grayDark}`,
        top: positionToTop ?? '0.3125rem',
        right: positionRight ?? '0.3125rem',
        position: position ? position : 'absolute',
        zIndex: zIndex ?? 'auto'
      }}
      onClick={onClick}
    >
      <CloseIcon />
    </IconButton>
  );
};

export default CloseButton;
