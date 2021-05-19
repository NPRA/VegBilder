import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';
import { currentImagePointState } from 'recoil/atoms';

const useStyles = makeStyles(() => ({
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
  },
}));

const ImageMetadata = () => {
  const classes = useStyles();

  const currentImagePoint = useRecoilValue(currentImagePointState);

  let roadReference;
  let dateAndTime;

  if (!currentImagePoint) return null;
  const { TIDSPUNKT } = currentImagePoint.properties;
  roadReference = getRoadReference(currentImagePoint).complete;
  const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
  dateAndTime = `${dateTime?.date} kl. ${dateTime?.time}`;

  return (
    <div className={classes.metadata}>
      <Typography variant="subtitle1">{roadReference}</Typography>
      <Typography variant="body1">{dateAndTime}</Typography>
    </div>
  );
};

export default ImageMetadata;
