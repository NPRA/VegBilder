import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { gdprText } from 'constants/text';
import OpenErrorSchemeTextButton from '../common/OpenErrorSchemeTextButton';

const useStyles = makeStyles(() => ({
  paragraphs: {
    paddingBottom: '1rem',
  },
}));

const Gdpr = () => {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      {openForm ? null : (
        <>
          <Typography variant="h4" className={classes.paragraphs}>
            {' '}
            {gdprText.header}
          </Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            {' '}
            {gdprText.text1}{' '}
          </Typography>
        </>
      )}
      <OpenErrorSchemeTextButton openForm={openForm} setOpenForm={setOpenForm} />
    </>
  );
};

export default Gdpr;
