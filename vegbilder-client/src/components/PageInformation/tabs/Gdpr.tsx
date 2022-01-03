import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { useTranslation } from "react-i18next";

import OpenErrorSchemeTextButton from '../common/OpenErrorSchemeTextButton';

const useStyles = makeStyles((theme) => ({
  paragraphs: {
    paddingBottom: '1rem',
  },
  link: {
    color: theme.palette.common.grayRegular,
    textDecoration: 'none',
    borderBottom: `1px solid ${theme.palette.common.grayRegular}`,
    '&:hover': {
      color: theme.palette.common.orangeDark,
      borderBottom: `1px solid ${theme.palette.common.orangeDark}`,
    },
  },
}));

const Gdpr = () => {
  const classes = useStyles();
  const { t } = useTranslation('pageInformation', {keyPrefix: 'GDPR'});
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      {openForm ? null : (
        <>
          <Typography variant="h4" className={classes.paragraphs}>
            {' '}
            {t('header')}
          </Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            {' '}
            {t('text1')}<a className={classes.link} target="_blank" rel="noreferrer" href="https://gdpr-info.eu/">GDPR</a>{t('text2')}
          </Typography>
        </>
      )}
      <OpenErrorSchemeTextButton openForm={openForm} setOpenForm={setOpenForm} />
    </>
  );
};

export default Gdpr;
