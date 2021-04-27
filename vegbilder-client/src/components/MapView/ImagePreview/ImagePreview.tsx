import React, { useState } from 'react';
import { Box, IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getImageUrl, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { imagePointQueryParameterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import Theme from 'theme/Theme';
import ImageInfo from 'components/ImageInfo/ImageInfo';
import ImageInfoButton from 'components/ImageInfo/ImageInfoButton';
import { EnlargeIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  image: {
    cursor: 'pointer',
    borderRadius: '0px 0px 10px 10px',
  },
  enlargeButton: {
    marginRight: '0.3rem',
  },
  infoButton: {
    margin: '0.4rem',
  },
  imagePreview: {
    color: Theme.palette.common.grayRegular,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    borderRadius: '10px',
    marginBottom: '0.35rem',
  },
  imageMetadata: {
    borderRadius: '10px 10px 0 0',
    padding: '0.25rem 0.75rem 0.75rem 0.75rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    background: 'rgba(46, 53, 57, 0.80)',
  },
  imagePreviewAndInfo: {
    width: '50vh',
    position: 'absolute',
    left: '1.1875rem',
    top: '1.1875rem',
    zIndex: 1,
    height: '95%',
  },
  buttons: {
    marginTop: '0.5rem',
  },
}));

interface IImagePreviewProps {
  openImageView: () => void;
}

const ImagePreview = ({ openImageView }: IImagePreviewProps) => {
  const classes = useStyles();
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [showInformation, setShowInformation] = useState(false);

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);

    const openImage = () => {
      if (latlng) setCurrentCoordinates({ ...latlng, zoom: 16 });
      openImageView();
    };

    return (
      <div className={classes.imagePreviewAndInfo}>
        <div className={classes.imagePreview}>
          <div className={classes.imageMetadata}>
            <ImageMetadata />
            <div className={classes.buttons}>
              <Tooltip title="Åpne bilde">
                <IconButton className={classes.enlargeButton} onClick={openImage}>
                  <EnlargeIcon />
                </IconButton>
              </Tooltip>
              <CloseButton position={'unset'} onClick={() => setCurrentImagePoint(null)} />
            </div>
          </div>
          <img
            src={getImageUrl(currentImagePoint)}
            className={classes.image}
            alt="Bilde tatt langs veg"
            onClick={openImage}
          />
        </div>
        {showInformation ? (
          <ImageInfo
            showInformation={showInformation}
            setShowInformation={setShowInformation}
            imagePoint={currentImagePoint}
            maxHeight={'50%'}
          />
        ) : (
          <>
            <div style={{ marginTop: '0.2rem' }} />
            <ImageInfoButton
              showInformation={showInformation}
              setShowInformation={setShowInformation}
              disabled={false}
            />
          </>
        )}
      </div>
    );
  } else return null;
};

export default ImagePreview;
