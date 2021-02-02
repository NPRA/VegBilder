import React, { useEffect, useState } from 'react';
import { IconButton, makeStyles, Popover, Typography } from '@material-ui/core';

import { toLocaleDateAndTime } from 'utilities/dateTimeUtilities';
import { getImagePointLatLng, getImageUrl, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint } from 'types';
import { InformIcon } from 'components/Icons/Icons';
import getImageJsonFile from 'apis/Vegvesen/getImageJsonFile';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: '15rem',
    padding: '1rem',
    marginBottom: '1rem',
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
  const [detectedObjects, setDetectedObjects] = useState<{ [key: string]: string }>({});
  const [detectedObjectsKeys, setDetectedObjectsKeys] = useState<string[]>([]);
  const [strekningsnavn, setStrekningsnavn] = useState('');

  const getMoreInfoProps = async (jsonUrl: string) => {
    await getImageJsonFile(jsonUrl).then((res) => {
      if (res) {
        setStrekningsnavn(res.exif_strekningsnavn);
        const detekterteObjekter = res.detekterte_objekter;
        const keys = Object.keys(detekterteObjekter);
        setDetectedObjectsKeys(keys);
        setDetectedObjects(detekterteObjekter);
      }
    });
  };

  useEffect(() => {
    if (imagePoint) {
      const jsonUrl = getImageUrl(imagePoint).replace('jpg', 'json');
      getMoreInfoProps(jsonUrl);
    }
  }, [imagePoint]);

  let roadReference = '';
  let dateAndTime = '';
  let position;

  if (imagePoint) {
    const { TIDSPUNKT } = imagePoint?.properties;
    roadReference = getRoadReference(imagePoint).complete;
    const dateTime = TIDSPUNKT ? toLocaleDateAndTime(TIDSPUNKT) : null;
    dateAndTime = `${dateTime?.date} kl. ${dateTime?.time}`;
    position = getImagePointLatLng(imagePoint);
  }

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
            {`Strekningsnavn: ${strekningsnavn}`}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Fylkenummer: ${imagePoint.properties.FYLKENUMMER}`}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Posisjon: ${position?.lat + ', ' + position?.lng}`}
          </Typography>
          <Typography variant="body1" className={classes.lines}>
            {' '}
            {`Retning: ${imagePoint.properties.RETNING}`}
          </Typography>
          <Typography variant="subtitle1" className={classes.lines}>
            Detekterte objekter
          </Typography>
          {detectedObjectsKeys.length ? (
            detectedObjectsKeys.map((key) => (
              <Typography variant="body1" className={classes.lines} key={key}>
                {`${key}: ${detectedObjects[key]} `}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" className={classes.lines}>
              Ingen
            </Typography>
          )}
        </Popover>
      ) : null}
    </>
  );
};

export default MoreImageInfo;
