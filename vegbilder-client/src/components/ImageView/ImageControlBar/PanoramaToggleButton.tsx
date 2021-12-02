import React from 'react';
import { FormGroup, FormControlLabel, Tooltip } from '@material-ui/core';
import { Switch } from '@material-ui/core';
import { IImagePoint } from "types";
import { useResetRecoilState } from 'recoil';
import { isPanoramaMinOrMaxZoomState } from 'recoil/atoms';
import { getImageType } from "utilities/imagePointUtilities";

interface IPanoramaToggleButton {
  panoramaModeIsActive: boolean;
  setPanoramaModeIsActive: (status: boolean) => void;
  isZoomedInImage: boolean;
  setIsZoomedInImage: (status: boolean) => void;
  currentImagePoint: IImagePoint | null;
}

const PanoramaToggleButton = ({
  panoramaModeIsActive, 
  setPanoramaModeIsActive, 
  isZoomedInImage, 
  setIsZoomedInImage, 
  currentImagePoint}: IPanoramaToggleButton) => {

  const currentImageType = currentImagePoint ? getImageType(currentImagePoint) : '';
  const resetPanoramaMinOrMaxZoom = useResetRecoilState(isPanoramaMinOrMaxZoomState);

  const switchPanoramaMode = () => {
    setPanoramaModeIsActive(!panoramaModeIsActive);
    resetPanoramaMinOrMaxZoom();
    if (isZoomedInImage) { /* Reset zoom in planar-view, if active */
      setIsZoomedInImage(!isZoomedInImage);
    };
  };

  return (
    <FormGroup>
      <Tooltip title={currentImageType !== 'panorama' ? 'Dette bildet har ikke 360-visning' : ''}>
        <FormControlLabel
          control={<Switch disabled={currentImageType !== 'panorama' ? true: false} checked={panoramaModeIsActive} onChange={switchPanoramaMode} name="Panorama-toggle" />}
          label="360-visning"
          labelPlacement="top"
        />
      </Tooltip>
    </FormGroup>
  )
};


export default PanoramaToggleButton;