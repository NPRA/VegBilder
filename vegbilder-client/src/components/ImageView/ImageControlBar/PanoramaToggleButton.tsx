import React, { useState, useRef, useEffect } from 'react';
import { FormGroup, FormControlLabel, Tooltip, Typography, makeStyles } from '@material-ui/core';
import { Switch } from '@material-ui/core';
import { useRect } from '@reactour/utils';
import { Mask } from '@reactour/mask';
import { Popover } from "@reactour/popover";
import { AnimatePresence, motion } from 'framer-motion';
import { IImagePoint } from "types";
import { useResetRecoilState } from 'recoil';
import { isPanoramaMinOrMaxZoomState } from 'recoil/atoms';
import { getImageType } from "utilities/imagePointUtilities";

const useStyles = makeStyles(() => ({
  panoramaLabel: {
    textAlign: 'center'  //Used to center text 
  }
}));
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

  const elementRef = useRef(null);
  const wrapperRef = useRef(null);
  const sizes = useRect(elementRef);

  const currentImageType = currentImagePoint ? getImageType(currentImagePoint) : '';
  const resetPanoramaMinOrMaxZoom = useResetRecoilState(isPanoramaMinOrMaxZoomState);

  const HIDE_POPOVER = 'HidePopover';
  const hidePopoverIsSet = localStorage.getItem(HIDE_POPOVER) === 'true';
  const [showPopover, setShowPopover] = useState(false);

  const classes = useStyles();

  useEffect(() => {
    if (!hidePopoverIsSet && currentImageType === 'panorama') {
      setTimeout(() => {
        setShowPopover(true);
      }, 2000);
    }
  }, [hidePopoverIsSet, currentImageType]);

  // Parameteres position, verticalAlign and horizontalAlign come from the reactour Popover.
  function createPopopArrow(position: any, verticalAlign: any, horizontalAlign: any) {
    const opositeSide: any = {
      top: 'bottom',
      bottom: 'top',
      right: 'left',
      left: 'right',
    };
  
    const width = 16;
    const height = 12;
    const isVertical = position === 'top' || position === 'bottom';
    const spaceFromSide = 57;
    const styleObj = {
      [isVertical ? 'borderLeft' : 'borderTop']: `${width /
        2}px solid transparent`, // CSS Triangle width
      [isVertical ? 'borderRight' : 'borderBottom']: `${width /
        2}px solid transparent`, // CSS Triangle width
      [`border${position[0].toUpperCase()}${position.substring(
        1
      )}`]: `${height}px solid #2E3539`, // CSS Triangle height
      [isVertical ? opositeSide[horizontalAlign] : verticalAlign]:
        height + spaceFromSide, // space from side
      [opositeSide[position]]: -height + 2,
    };
  
    return {
      '&::after': {
        content: "''",
        width: 0,
        height: 0,
        position: 'absolute',
        ...styleObj,
      },
    };
  }

  const popoverStyles = {
    popover: (base: any, state: any) => {
      return {
        ...base,
        backgroundColor: '#2E3539',
        borderRadius: '10px',
        left: '30px',
        top: '-10px',
        transition: 'none',
        ...createPopopArrow(state.position, state.verticalAlign, state.horizontalAlign)
      }
    }
  }

  const handlePopoverRemoval = () => {
    localStorage.setItem(HIDE_POPOVER, 'true');
    setShowPopover(false);
  }

  const switchPanoramaMode = () => {
    setPanoramaModeIsActive(!panoramaModeIsActive);
    resetPanoramaMinOrMaxZoom();
    if (isZoomedInImage) { /* Reset zoom in planar-view, if active */
      setIsZoomedInImage(!isZoomedInImage);
    };
    if (!hidePopoverIsSet) {
      handlePopoverRemoval();
    }
  };

  return (
    <div ref={wrapperRef}>
    <FormGroup>
      <Tooltip ref={elementRef} title={currentImageType !== 'panorama' ? 'Dette bildet har ikke 360-visning' : ''}>
        <FormControlLabel
          control={<Switch disabled={currentImageType !== 'panorama' ? true: false} checked={panoramaModeIsActive} onChange={switchPanoramaMode} name="Panorama-toggle" />}
          label="360-visning"
          labelPlacement="top"
          className={classes.panoramaLabel}
        />
      </Tooltip>
    </FormGroup>
    <AnimatePresence>
    {showPopover ? 
      <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{ position: 'relative', zIndex: 99999 }}
    >
        <Mask 
        sizes={sizes}
        styles={{maskWrapper: base => ({...base, zIndex: 99999})}}
        onClick={handlePopoverRemoval}
      />
        <Popover sizes={sizes} position="top" styles={popoverStyles}>
          <Typography>Her kan du skru av og på 360-visning</Typography>
        </Popover>
      </motion.div>
    : null}
      </AnimatePresence>
    </div>
  )
};


export default PanoramaToggleButton;