import React, { useState } from 'react';
import { Button, makeStyles, Typography } from '@material-ui/core';

import {useTranslation} from "react-i18next";
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
  const { t, i18n } = useTranslation('pageInformation', {keyPrefix: 'omVegbilder'});

  const HIDE_SPLASH_ON_STARTUP = 'HideSplashOnStartup';

  const hideWasSet = localStorage.getItem(HIDE_SPLASH_ON_STARTUP) === 'true';
  const [hideOnStartup, setHideOnStartup] = useState(hideWasSet);

  const handleStartupChange = () => {
    hideOnStartup
      ? localStorage.removeItem(HIDE_SPLASH_ON_STARTUP)
      : localStorage.setItem(HIDE_SPLASH_ON_STARTUP, 'true');
    setHideOnStartup(!hideOnStartup);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.setAttribute('lang', lng);
  }

  return (
    <>
      <Typography variant="h4"> {t('header')}</Typography>
      <img
        src={`${process.env.PUBLIC_URL}/images/E6-Dovrefjell-Snohetta-lower.jpg`}
        alt="Bilde av E6 ved Dovrefjell Snøhetta"
        width="100%"
        className={classes.image}
      />
      <div className={classes.rightLeftText}>
        <Typography variant="body1" className={classes.paragraphs}>
          {' '}
          {t('image_description')}{' '}
        </Typography>
        <Typography variant="body1" className={classes.paragraphs}>
          {' '}
          {t('image_credits')}{' '}
        </Typography>
      </div>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {t('text1')}{' '}
      </Typography>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {t('text2')}{' '}
      </Typography>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <CheckBox
          handleChange={handleStartupChange}
          label={t('checkboxLabel')}
          checked={hideWasSet}
        />
        <div style={{display: "flex", alignItems: "center", justifyContent: "space-between", width: '16.5rem'}}>
          <Typography>{t('lng')} </Typography>
          <div style={{display: "flex", justifyContent: "flex-end"}}>
            <Button onClick={() => changeLanguage('no')} style={{color: i18n.resolvedLanguage === 'no' ? '#F67F00' : '', padding: '0px'}}>Norsk (nb)</Button>
            <Button onClick={() => changeLanguage('en')} style={{color: i18n.resolvedLanguage === 'en' ? '#F67F00' : '', padding: '0px'}}>English</Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
