import React, { useState } from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getImageUrl, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { imagePointQueryParameterState, latLngZoomQueryParameterState } from 'recoil/selectors';
import Theme from 'theme/Theme';
import MoreImageInfo from 'components/ImageView/SideControlBar/MoreImageInfo/MoreImageInfo';
import MoreImageInfoButton from 'components/ImageView/SideControlBar/SideControlButtons/MoreImageInfoButton';

const useStyles = makeStyles((theme) => ({
  image: {
    cursor: 'pointer',
    borderRadius: '0px 0px 10px 10px',
  },
  enlargeButton: {
    '& span': {
      '& svg': {
        width: '21px',
        height: '21px',
      },
    },
  },
  infoButton: {
    margin: '0.4rem',
  },
  imagePreview: {
    color: Theme.palette.common.grayRegular,
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    width: '50vh',
    borderRadius: '10px',
  },
  imageMetadata: {
    backgroundColor: Theme.palette.common.grayDarker,
    borderRadius: '10px 10px 0 0',
    padding: '0.25rem 0.75rem 0.75rem 0.75rem',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    opacity: 0.8,
  },
  imageInfoPreview: {
    position: 'absolute',
    left: '1.1875rem',
    top: '1.1875rem',
    zIndex: 1,
    height: '95%',
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
      <div className={classes.imageInfoPreview}>
        <div className={classes.imagePreview}>
          <div className={classes.imageMetadata}>
            <ImageMetadata />
          </div>
          <>
            <img
              src={getImageUrl(currentImagePoint)}
              className={classes.image}
              alt="Bilde tatt langs veg"
              onClick={openImage}
            />
            <CloseButton onClick={() => setCurrentImagePoint(null)} />
          </>
        </div>
        {showInformation ? (
          <MoreImageInfo
            showInformation={showInformation}
            setShowInformation={setShowInformation}
            disabled={false}
            imagePoint={currentImagePoint}
          />
        ) : (
          <MoreImageInfoButton
            showInformation={showInformation}
            setShowInformation={setShowInformation}
            disabled={false}
          />
        )}
      </div>
    );
  } else return null;
};

export default ImagePreview;
