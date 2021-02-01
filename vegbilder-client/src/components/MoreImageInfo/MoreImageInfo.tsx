import React from 'react';
import { makeStyles, Popover, Typography } from '@material-ui/core';

import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: '15rem',
    padding: '2rem',
  },
}));

interface IMoreImageInfoProps {
  imagePoint: IImagePoint;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
  handleClose: ((event: {}, reason: 'backdropClick' | 'escapeKeyDown') => void) | undefined;
}

const MoreImageInfo = ({ imagePoint, anchorEl, handleClose }: IMoreImageInfoProps) => {
  const classes = useStyles();

  if (!imagePoint) return null;
  const { TIDSPUNKT } = imagePoint?.properties;
  const roadReference = getRoadReference(imagePoint).complete;
  const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
  const dateAndTime = `${dateTime?.date} kl. ${dateTime?.time}`;
  const position = getImagePointLatLng(imagePoint);

  return (
    <>
      {imagePoint ? (
        <Popover
          className={classes.popover}
          id={Boolean(anchorEl) ? 'more-info' : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
        >
          <Typography variant="subtitle1">{roadReference}</Typography>
          <Typography variant="body1"> {dateAndTime} </Typography>
          <Typography variant="body1">
            {' '}
            {`Fylkenummer: ${imagePoint.properties.FYLKENUMMER}`}
          </Typography>
          <Typography variant="body1"> {`Posisjon: ${(position?.lat, position?.lng)}`}</Typography>
        </Popover>
      ) : null}
    </>
  );
};

export default MoreImageInfo;
