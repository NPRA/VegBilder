import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getRoadReference } from 'utilities/imagePointUtilities';
import { useRecoilValue } from 'recoil';
import { currentHistoryImageState, isHistoryModeState } from 'recoil/atoms';

const useStyles = makeStyles({
  roadReference: {
    fontWeight: 'bold',
  },
});

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
      <span className={classes.roadReference}>{roadReference}</span>
      <br />
      {dateAndTime}
    </>
  );
};

export default ImageMetadata;
