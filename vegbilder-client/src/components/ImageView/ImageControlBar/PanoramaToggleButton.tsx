import React, { useState } from 'react';
import { FormGroup, FormControlLabel, Typography, Grid } from '@material-ui/core';
import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { IImagePoint } from "types";
import { getImageType } from "utilities/imagePointUtilities";


interface IPanoramaToggleButton {
  panoramaIsActive: boolean;
  setPanoramaIsActive: (status: boolean) => void;
  currentImagePoint: IImagePoint | null;
}

const PanoramaToggleButton = ({panoramaIsActive, setPanoramaIsActive, currentImagePoint}:IPanoramaToggleButton) => {
  const [checked, setChecked] = useState(false);
  const currentImageType = currentImagePoint ? getImageType(currentImagePoint) : '';


  const handleChange = () => {
    setChecked(!checked);
    setPanoramaIsActive(!panoramaIsActive);
  };

  return (
    <FormGroup>
      <FormControlLabel
        control={<Switch disabled={ currentImageType !== 'panorama' ? true: false} checked={checked} onChange={handleChange} color="secondary" name="360-toggle" />}
        label="360-visning"
        labelPlacement="top"
      />
    </FormGroup>
  )
};


export default PanoramaToggleButton;