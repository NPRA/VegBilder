import React from 'react';
import { IconButton, makeStyles, Popover, Typography } from '@material-ui/core';

import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { InformIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: '15rem',
    padding: '1rem',
    border: `1px solid ${theme.palette.common.grayDark}`,
  },
  lines: {
    padding: '0.2rem',
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
  console.log(imagePoint);

  return (
    <>
      {imagePoint && anchorEl ? (
        <Popover
          id={Boolean(anchorEl) ? 'more-info' : undefined}
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          PaperProps={{ classes: { root: classes.popover } }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <Typography variant="subtitle1" className={classes.lines}>
            {roadReference}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {dateAndTime}{' '}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Fylkenummer: ${imagePoint.properties.FYLKENUMMER}`}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Posisjon: ${'lat: ' + position?.lat + ', lng: ' + position?.lng}`}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Retning: ${imagePoint.properties.RETNING}`}
          </Typography>
        </Popover>
      ) : null}
    </>
  );
};

export default MoreImageInfo;
