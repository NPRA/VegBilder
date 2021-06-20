import {
  makeStyles,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Typography,
  Radio,
} from '@material-ui/core';
import { CameraAltOutlined } from '@material-ui/icons';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  cameraFilterState,
  currentImagePointState,
  currentLatLngZoomState,
  currentYearState,
  loadedImagePointsState,
} from 'recoil/atoms';
import { cameraTypes } from 'types';

const useStyles = makeStyles((theme) => ({
  menu: {
    position: 'absolute',
    marginTop: '1.35rem',
    left: 0,
    color: theme.palette.common.grayRegular,
    backgroundColor: theme.palette.common.grayDarker,
    borderRadius: '10px',
    padding: '1rem',
    width: '100%',
    border: `0.5px solid ${theme.palette.common.grayDark}`,
    maxHeight: '40rem',
    overflowY: 'auto',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
}));

interface IFilterProps {
  openMenu: boolean;
  setOpenMenu: (openMenu: boolean) => void;
  showMessage: (message: string) => void;
}

const Filter = ({ openMenu, setOpenMenu, showMessage }: IFilterProps) => {
  const classes = useStyles();
  const [cameraTypeFilter, setCameraTypeFilter] = useRecoilState(cameraFilterState);
  const currentCoordinates = useRecoilValue(currentLatLngZoomState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const setLoadedImagePoits = useSetRecoilState(loadedImagePointsState);
  const fetchNearestImagePoint = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder i nærheten med det kamerafilteret.'
  );

  const [vegtyperChecked, setVegtyperChecked] = useState({ riksveger: false, fylkesveger: false });

  const handleCameraTypeFilterCheck = (cameraType: cameraTypes) => {
    setCameraTypeFilter(cameraType);
    if (currentImagePoint) {
      // if we already have an image preview, we need to fetch new image points and find a new image preview for that camera filter
      // otherwise, we dont have to do anything besides switching map layer
      setLoadedImagePoits(null); // reset state
      const latlng = { lat: currentCoordinates.lat, lng: currentCoordinates.lng };
      fetchNearestImagePoint(latlng, currentImagePoint.properties.AAR);
    }
  };

  const { riksveger, fylkesveger } = vegtyperChecked;

  return (
    <>
      {openMenu && (
        <div className={classes.menu} tabIndex={1}>
          <FormControl component="fieldset">
            {/* <Typography variant="h5"> Vegtyper </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={riksveger} onChange={handleChange} name="riksveger" />}
                label="Riksveger"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={fylkesveger} onChange={handleChange} name="Fylkesveger" />
                }
                label="Fylkesveger"
              />
            </FormGroup> */}
            <FormGroup>
              <Typography variant="h5"> Kameratype </Typography>
              <FormControlLabel
                control={
                  <Radio
                    checked={cameraTypeFilter === 'panorama'}
                    onChange={() => {
                      handleCameraTypeFilterCheck('panorama');
                    }}
                    name="panorama"
                  />
                }
                label="360"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={cameraTypeFilter === 'dekkekamera'}
                    onChange={() => {
                      handleCameraTypeFilterCheck('dekkekamera');
                    }}
                    name="dekkekamera"
                  />
                }
                label="Dekkekamera"
              />
              <FormControlLabel
                control={
                  <Radio
                    checked={cameraTypeFilter === 'planar'}
                    onChange={() => {
                      handleCameraTypeFilterCheck('planar');
                    }}
                    name="planar"
                  />
                }
                label="Planar"
              />
            </FormGroup>
          </FormControl>
        </div>
      )}
    </>
  );
};

export default Filter;
