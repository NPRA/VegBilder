import React from 'react';
import { useSetRecoilState } from 'recoil';
import { IconButton, makeStyles, Tooltip } from '@material-ui/core';
import { useTranslation } from "react-i18next";

import { MyLocationIcon } from 'components/Icons/Icons';
import { latLngZoomQueryParameterState } from 'recoil/selectors';

const useStyles = makeStyles((theme) => ({
  zoomControl: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: theme.palette.common.grayDark,
    borderRadius: '0.625rem',
    marginBottom: '1rem',
  },
}));

interface IMyLocationControlProps {
  showMessage: (message: string) => void;
}

const MyLocationControl = ({ showMessage }: IMyLocationControlProps) => {
  const classes = useStyles();
  const { t } = useTranslation(['mapView', 'snackbar']);
  const setCurrentCoordinates = useSetRecoilState(latLngZoomQueryParameterState);
  const tooltipTitle = t('mapView:buttons.position');

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentCoordinates({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          zoom: 15,
        });
      },
      (err) => {
        showMessage(t('snackbar:fetchMessage.locationError'));
        console.warn(err);
      }
    );
  };

  return (
    <div className={classes.zoomControl}>
      <Tooltip title={tooltipTitle}>
        <IconButton onClick={getLocation}>
          <MyLocationIcon id="my-location" />
        </IconButton>
      </Tooltip>
    </div>
  );
};

export default MyLocationControl;
