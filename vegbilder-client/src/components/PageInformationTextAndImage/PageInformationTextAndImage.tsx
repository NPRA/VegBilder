import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { informationText } from 'constants/text';

const useStyles = makeStyles(() => ({
  content: {
    margin: '2rem 2rem 0 2rem',
  },
  headline: {
    textAlign: 'center',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  image: {
    display: 'block',
    margin: 'auto auto',
    padding: '1rem 0 0 0',
  },
  rightLeftText: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

const PageInformationTextAndImage = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h2" className={classes.headline}>
        {' '}
        {informationText.header}{' '}
      </Typography>
      <img
        src={`${process.env.PUBLIC_URL}/images/E6-Dovrefjell-Snohetta-lower.jpg`}
        alt="Bilde av E6 ved Dovrefjell Snøhetta"
        width="100%"
        className={classes.image}
      />
      <div className={classes.rightLeftText}>
        <Typography variant="body1" className={classes.paragraphs}>
          {' '}
          {informationText.photoDescription}{' '}
        </Typography>
        <Typography variant="body1" className={classes.paragraphs}>
          {' '}
          {informationText.photoBy}{' '}
        </Typography>
      </div>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {informationText.text}{' '}
      </Typography>

      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {informationText.text2}{' '}
      </Typography>
    </>
  );
};

export default PageInformationTextAndImage;
