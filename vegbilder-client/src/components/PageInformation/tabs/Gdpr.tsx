import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import {useTranslation} from "react-i18next";

import OpenErrorSchemeTextButton from '../common/OpenErrorSchemeTextButton';

const useStyles = makeStyles(() => ({
  paragraphs: {
    paddingBottom: '1rem',
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
            {t('text1')}{' '}
          </Typography>
        </>
      )}
      <OpenErrorSchemeTextButton openForm={openForm} setOpenForm={setOpenForm} />
    </>
  );
};

export default Gdpr;
