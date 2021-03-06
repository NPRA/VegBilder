import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { informationText } from 'constants/text';
import CheckBox from 'components/CheckBox/CheckBox';

const useStyles = makeStyles((theme) => ({
  paragraphs: {
    paddingBottom: '1rem',
  },
  openFeedbackScheme: {
    position: 'sticky',
    border: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `1px solid ${theme.palette.common.grayRegular}`,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '1rem',
    '&:hover': {
      color: theme.palette.common.orangeDark,
      borderBottom: `1px solid ${theme.palette.common.orangeDark}`,
    },
  },
  headline: {
    textAlign: 'center',
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

const About = () => {
  const classes = useStyles();

  const HIDE_SPLASH_ON_STARTUP = 'HideSplashOnStartup';

  const hideWasSet = localStorage.getItem(HIDE_SPLASH_ON_STARTUP) === 'true';
  const [hideOnStartup, setHideOnStartup] = useState(hideWasSet);

  const handleStartupChange = () => {
    hideOnStartup
      ? localStorage.removeItem(HIDE_SPLASH_ON_STARTUP)
      : localStorage.setItem(HIDE_SPLASH_ON_STARTUP, 'true');
    setHideOnStartup(!hideOnStartup);
  };

  return (
    <>
      <Typography variant="h4"> {informationText.header}</Typography>
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
        {informationText.text1}{' '}
      </Typography>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {informationText.text2}{' '}
      </Typography>
      <div>
        <CheckBox
          handleChange={handleStartupChange}
          label={'Ikke vis ved oppstart'}
          checked={hideWasSet}
        />
      </div>
    </>
  );
};

export default About;
