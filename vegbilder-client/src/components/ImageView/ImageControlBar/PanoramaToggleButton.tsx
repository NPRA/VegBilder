import React from 'react';
import { FormGroup, FormControlLabel, SwitchClassKey, SwitchProps } from '@material-ui/core';
import { Switch } from '@material-ui/core';
import { createStyles, withStyles, Theme } from '@material-ui/core/styles';
import { IImagePoint } from "types";
import { getImageType } from "utilities/imagePointUtilities";

interface Styles extends Partial<Record<SwitchClassKey, string>> {
  focusVisible?: string;
}

interface Props extends SwitchProps {
  classes: Styles;
}


const PanoramaSwitch = withStyles((theme: Theme) =>
  createStyles({
    root: {
      width: 43,
      height: 24,
      padding: 0,
      margin: 2,
      '&:disabled': {
        color: theme.palette.common.grayRegular
      }
    },
    switchBase: {
      height: 24,
      width: 24,
      padding: 0,
      '&$checked': {
        transform: 'translateX(19px)',
        color: theme.palette.common.white,
        '& + $track': {
          backgroundColor: theme.palette.common.orangeDark,
          opacity: 1,
          border: 'none',
        },
      },
      '&$focusVisible $thumb': {
        color: '#52d869',
        border: '6px solid #fff',
      },
    },
    thumb: {
      width: 24,
      height: 24,
      '&.hover': {
        border: 'none'
      }
    },
    track: {
      borderRadius: 26 / 2,
      border: `none`,
      backgroundColor: theme.palette.common.grayRegularLight,
      opacity: 1,
      transition: theme.transitions.create(['background-color', 'border']),
    },
    checked: {},
    focusVisible: {},
    disabled: {}
  }),
)(({ classes, ...props }: Props) => {
  return (
    <Switch
      focusVisibleClassName={classes.focusVisible}
      disableRipple
      classes={{
        root: classes.root,
        switchBase: classes.switchBase,
        thumb: classes.thumb,
        track: classes.track,
        checked: classes.checked,
      }}
      {...props}
    />
  );
});

interface IPanoramaToggleButton {
  panoramaIsActive: boolean;
  setPanoramaIsActive: (status: boolean) => void;
  currentImagePoint: IImagePoint | null;
}

const PanoramaToggleButton = ({panoramaIsActive, setPanoramaIsActive, currentImagePoint}:IPanoramaToggleButton) => {
  const currentImageType = currentImagePoint ? getImageType(currentImagePoint) : '';

  const handleChange = () => {
    setPanoramaIsActive(!panoramaIsActive);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<PanoramaSwitch disabled={currentImageType !== 'panorama' ? true: false} checked={panoramaIsActive} onChange={handleChange} name="360-toggle" />}
        label="360-visning"
        labelPlacement="top"
      />
    </FormGroup>
  )
};


export default PanoramaToggleButton;