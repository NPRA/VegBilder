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
  customStyle?: {};
  iconSize?: 
  | 'default'
  | 'inherit'
  | 'large'
  | 'small'
}

const CloseButton = ({ onClick, transparent, positionToTop, positionToRight, position, zIndex, customStyle, iconSize }: ICloseButtonProps) => {
  const classes = useStyles();
  const fontSize = iconSize ? iconSize : "default";
  return (
    <IconButton
      className={classes.closeButton}
      style={customStyle ? customStyle 
        : {
        background: transparent ? 'transparent' : `${Theme.palette.common.grayDark}`,
        top: positionToTop ?? '0.3125rem',
        right: positionToRight ?? '0.3125rem',
        position: position ? position : 'absolute',
        zIndex: zIndex ?? 'auto'
      }}
      onClick={onClick}
    >
      <CloseIcon fontSize={fontSize} />
    </IconButton>
  );
};

export default CloseButton;
