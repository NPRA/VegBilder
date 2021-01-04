import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';

const useStyles = makeStyles({
  roadReference: {
    fontWeight: 'bold',
  },
});

const ImageMetadata = () => {
  const classes = useStyles();
  const { currentImagePoint } = useCurrentImagePoint();
  if (!currentImagePoint) return null;

  const { TIDSPUNKT } = currentImagePoint.properties;
  const roadReference = getRoadReference(currentImagePoint).complete;
  const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
  const dateAndTime = `${dateTime.date} kl. ${dateTime.time}`;

  return (
    <>
      <span className={classes.roadReference}>{roadReference}</span>
      <br />
      {dateAndTime}
    </>
  );
};

export default ImageMetadata;
