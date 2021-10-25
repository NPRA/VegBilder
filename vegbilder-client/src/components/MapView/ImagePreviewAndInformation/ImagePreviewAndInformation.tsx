import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getImageUrl, getImageType, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { imagePointQueryParameterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import ImageInfo from 'components/ImageInfo/ImageInfo';
import ImageInfoButton from 'components/ImageInfo/ImageInfoButton';
import { EnlargeIcon, PanoramaIcon } from 'components/Icons/Icons';
import Theme from 'theme/Theme';
import PanoramaImage from '../../ImageView/ImageViewer/PanoramaImage/PanoramaImage';

const useStyles = makeStyles(() => ({
  image: {
    cursor: 'pointer',
    borderRadius: '0px 0px 10px 10px',
    maxHeight: '500px',
    height: '500px',
    objectFit: 'none',
    transform: 'scale(1.2)'
  },
  panoramaImage: {
    height: '25vh',
    width: '50vw',
    backgroundSize: '80vh 40vw',
    backgroundPosition: 'center'
  },
  enlargeButton: {
    marginRight: '0.3rem',
    backgroundColor: Theme.palette.common.grayDark,
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
    maxHeight: '25rem',
    pointerEvents: 'all',
    overflow: 'hidden',
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
    width: '30vw',
    maxWidth: '30rem',
    minWidth: '16.375rem',
    position: 'absolute',
    left: '1.1875rem',
    top: '1.1875rem',
    zIndex: 1,
    pointerEvents: 'none',
  },
  panoramaIcon: {
    position: 'absolute',
    fill: Theme.palette.common.orangeDark,
    right: '10px',
    bottom: '50px',
  },
  buttons: {
    marginTop: '0.5rem',
  },
}));

interface IImagePreviewAndInfoProps {
  openImageView: () => void;
}

const ImagePreviewAndInformation = ({ openImageView }: IImagePreviewAndInfoProps) => {
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
          <div className={classes.panoramaImage} style={{"backgroundImage" : `url(${getImageUrl(currentImagePoint)})`}}></div>
{/*           <img
              src={getImageUrl(currentImagePoint)}
              className={classes.image}
              alt="Bilde tatt langs veg"
              onClick={openImage}
            /> */}
            {getImageType(currentImagePoint) === '360' ?
            <div className={classes.panoramaIcon}>
              <PanoramaIcon/>
            </div> : null}
        </div>
        {showInformation ? (
          <ImageInfo
            showInformation={showInformation}
            setShowInformation={setShowInformation}
            imagePoint={currentImagePoint}
            maxHeight={'50vh'}
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

export default ImagePreviewAndInformation;
