import React from 'react';
import { FormGroup, FormControlLabel} from '@material-ui/core';
import { Switch } from '@material-ui/core';
import { IImagePoint } from "types";
import { getImageType } from "utilities/imagePointUtilities";

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
        control={<Switch disabled={currentImageType !== 'panorama' ? true: false} checked={panoramaIsActive} onChange={handleChange} name="360-toggle" />}
        label="360-visning"
        labelPlacement="top"
      />
    </FormGroup>
  )
};


export default PanoramaToggleButton;