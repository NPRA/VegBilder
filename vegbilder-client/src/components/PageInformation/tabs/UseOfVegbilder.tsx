import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { helpText } from 'constants/text';
import OpenErrorSchemeTextButton from '../common/OpenErrorSchemeTextButton';

const useStyles = makeStyles(() => ({
  paragraphs: {
    paddingBottom: '1rem',
  },
}));

const UseOfVebilder = () => {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);

  return (
    <>
      {openForm ? null : (
        <>
          <Typography variant="h4" className={classes.paragraphs}>
            {' '}
            {helpText.header1}
          </Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            {' '}
            {helpText.text1}{' '}
          </Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            {' '}
            {helpText.text2}
          </Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            {' '}
            {helpText.text3}
          </Typography>
        </>
      )}
      <OpenErrorSchemeTextButton openForm={openForm} setOpenForm={setOpenForm} />
    </>
  );
};

export default UseOfVebilder;
