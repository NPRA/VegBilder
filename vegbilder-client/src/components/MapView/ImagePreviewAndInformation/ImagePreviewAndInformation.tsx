import React, { useState } from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { useTranslation } from "react-i18next";

import { getImageUrl, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { imagePointQueryParameterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import ImageInfo from 'components/ImageInfo/ImageInfo';
import ImageInfoButton from 'components/ImageInfo/ImageInfoButton';
import { EnlargeIcon } from 'components/Icons/Icons';
import Theme from 'theme/Theme';

const useStyles = makeStyles(() => ({
  image: {
    cursor: 'pointer',
    borderRadius: '0px 0px 10px 10px',
    maxHeight: '28vh',
    height: 'auto',
  },
  panoramaImage: {
    cursor: 'pointer',
    height: '25vh',
    width: '30vw',
    minWidth: '16.375rem',
    backgroundSize: '100vw',
    backgroundPosition: 'center'
  },
  panoramaImageContainer: {
    width: 'auto',
    position: 'relative'
  },
  panoramaIcon: {
    position: 'absolute',
    fill: Theme.palette.common.orangeDark,
    right: '4px',
    bottom: '4px',
    '& svg': {
      verticalAlign: 'top'
    }
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
  buttons: {
    marginTop: '0.5rem',
  },
}));

interface IImagePreviewAndInfoProps {
  openImageView: () => void;
}

const ImagePreviewAndInformation = ({ openImageView }: IImagePreviewAndInfoProps) => {
  const classes = useStyles();
  const { t } = useTranslation('mapView');
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);
  const [showInformation, setShowInformation] = useState(false);

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);

    const openImage = () => {
      if (latlng) setCurrentCoordinates({ ...latlng, zoom: 16 });
      openImageView();
    };

    const tooltipTitle = t('buttons.openImage');

    return (
      <div className={classes.imagePreviewAndInfo}>
        <div className={classes.imagePreview}>
          <div className={classes.imageMetadata}>
            <ImageMetadata />
            <div className={classes.buttons}> 
              <Tooltip title={tooltipTitle}>
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
            alt={t('preview.imageAlt')}
            onClick={openImage}
            />
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
