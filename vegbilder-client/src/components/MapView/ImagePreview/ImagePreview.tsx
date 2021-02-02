import React from 'react';
import { Box, IconButton } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import { useCurrentCoordinates } from 'contexts/CurrentCoordinatesContext';
import { getImageUrl, getImagePointLatLng } from 'utilities/imagePointUtilities';
import ImageMetadata from 'components/ImageMetadata/ImageMetadata';
import { EnlargeIcon } from 'components/Icons/Icons';
import CloseButton from 'components/CloseButton/CloseButton';
import MoreImageInfo from 'components/MoreImageInfo/MoreImageInfo';

const useStyles = makeStyles((theme) => ({
  image: {
    width: '30rem',
    margin: '2px 2px 0 2px',
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
  const { currentImagePoint, unsetCurrentImagePoint } = useCurrentImagePoint();
  const { setCurrentCoordinates } = useCurrentCoordinates();

  if (currentImagePoint) {
    const latlng = getImagePointLatLng(currentImagePoint);

    const openImage = () => {
      setCurrentCoordinates({ latlng: latlng, zoom: 16 });
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
      >
        <>
          <img
            src={getImageUrl(currentImagePoint)}
            className={classes.image}
            alt="Bilde tatt langs veg"
          />
          <CloseButton onClick={unsetCurrentImagePoint} />
        </>
        <Box
          padding="0.25rem 0.75rem 0.75rem 0.75rem"
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
        >
          <ImageMetadata />
          <div>
            <MoreImageInfo imagePoint={currentImagePoint} className={classes.infoButton} />
            <IconButton className={classes.enlargeButton} onClick={openImage}>
              <EnlargeIcon />
            </IconButton>
          </div>
        </Box>
      </Box>
    );
  } else return null;
};

export default ImagePreview;
