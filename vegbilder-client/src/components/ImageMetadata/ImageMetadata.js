import React from 'react';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';
import { Typography } from '@material-ui/core';

const ImageMetadata = () => {
  const { currentImagePoint } = useCurrentImagePoint();
  if (!currentImagePoint) return null;

  const { TIDSPUNKT } = currentImagePoint.properties;
  const roadReference = getRoadReference(currentImagePoint).complete;
  const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
  const dateAndTime = `${dateTime.date} kl. ${dateTime.time}`;

  return (
    <>
      <Typography variant="subtitle1">{roadReference}</Typography>
      <Typography variant="body1">{dateAndTime}</Typography>
    </>
  );
};

export default ImageMetadata;
