import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useRecoilValue } from 'recoil';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';
import { currentHistoryImageState, isHistoryModeState } from 'recoil/atoms';

const useStyles = makeStyles(() => ({
  metadata: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
  },
}));

const ImageMetadata = () => {
  const classes = useStyles();

  const { currentImagePoint } = useCurrentImagePoint();
  const currentHistoryImage = useRecoilValue(currentHistoryImageState);
  const isHistoryMode = useRecoilValue(isHistoryModeState);

  let roadReference;
  let dateAndTime;

  if (isHistoryMode) {
    if (!currentHistoryImage) return null;
    const { TIDSPUNKT } = currentHistoryImage.properties;
    roadReference = getRoadReference(currentHistoryImage).complete;
    const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
    dateAndTime = `${dateTime?.date} kl. ${dateTime?.time}`;
  } else {
    if (!currentImagePoint) return null;
    const { TIDSPUNKT } = currentImagePoint.properties;
    roadReference = getRoadReference(currentImagePoint).complete;
    const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
    dateAndTime = `${dateTime?.date} kl. ${dateTime?.time}`;
  }

  return (
    <div className={classes.metadata}>
      <Typography variant="subtitle1">{roadReference}</Typography>
      <Typography variant="body1">{dateAndTime}</Typography>
    </div>
  );
};

export default ImageMetadata;
