import React from 'react';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { getImageUrl, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import CloseButton from 'components/CloseButton/CloseButton';
import { useRecoilState } from 'recoil';
import { imagePointQueryParameterState, latLngZoomQueryParameterState } from 'recoil/selectors';

const useStyles = makeStyles((theme) => ({
  image: {
    margin: '2px 2px 0 2px',
    cursor: 'pointer',
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
}));

interface IImagePreviewProps {
  openImageView: () => void;
}

const ImagePreview = ({ openImageView }: IImagePreviewProps) => {
  const classes = useStyles();
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);
  const [, setCurrentCoordinates] = useRecoilState(latLngZoomQueryParameterState);

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);

    const openImage = () => {
      if (latlng) setCurrentCoordinates({ ...latlng, zoom: 16 });
      openImageView();
    };

    return (
      <Box
        position="absolute"
        right="1.1875rem"
        bottom="1.1875rem"
        zIndex="1"
        borderRadius="3px"
        bgcolor="primary.main"
        color="primary.contrastText"
        display="flex"
        flexDirection="column"
        boxShadow="1px 2px 2px 2px rgba(0, 0, 0, 0.4)"
        width="50vh"
      >
        <>
          <img
            src={getImageUrl(currentImagePoint)}
            className={classes.image}
            alt="Bilde tatt langs veg"
            onClick={openImage}
          />
          <CloseButton onClick={() => setCurrentImagePoint(null)} />
        </>
        <Box
          padding="0.25rem 0.75rem 0.75rem 0.75rem"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <ImageMetadata />
        </Box>
      </Box>
    );
  } else return null;
};

export default ImagePreview;
