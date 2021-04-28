import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { helpText } from 'constants/text';
import OpenErrorSchemeTextButton from '../common/OpenErrorSchemeTextButton';

const useStyles = makeStyles(() => ({
  content: {
    margin: '2rem 2rem 1rem 2rem',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  rigthLeftText: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  icon: {
    width: '0.8rem',
    height: '0.8rem',
    margin: '0 0.1rem',
  },
}));

const UseOfVebilder = () => {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);

  return (
    <div className={classes.content}>
      {openForm ? null : (
        <>
          <Typography variant="h2" className={classes.paragraphs}>
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
    </div>
  );
};

export default UseOfVebilder;
