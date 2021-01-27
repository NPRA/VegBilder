import React from 'react';
import { Typography } from '@material-ui/core';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';
import { useRecoilValue } from 'recoil';
import { currentHistoryImageState, isHistoryModeState } from 'recoil/atoms';

const ImageMetadata = () => {
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
    dateAndTime = `${dateTime.date} kl. ${dateTime.time}`;
  } else {
    if (!currentImagePoint) return null;
    const { TIDSPUNKT } = currentImagePoint.properties;
    roadReference = getRoadReference(currentImagePoint).complete;
    const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
    dateAndTime = `${dateTime.date} kl. ${dateTime.time}`;
  }

  return (
    <>
      <Typography variant="subtitle1">{roadReference}</Typography>
      <Typography variant="body1">{dateAndTime}</Typography>
    </>
  );
};

export default ImageMetadata;
