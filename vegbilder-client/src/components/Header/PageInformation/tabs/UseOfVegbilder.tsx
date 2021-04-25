import React, { useState } from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { helpText } from 'constants/text';
import { DotsHorizontalSmallIcon, HistorySmallIcon } from 'components/Icons/Icons';
import { FEEDBACK_SCHEME_URL } from 'constants/urls';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: '2rem 2rem 1rem 2rem',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  openFeedbackScheme: {
    position: 'sticky',
    border: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `1px solid ${theme.palette.common.charcoalLighter}`,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '1rem',
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
        {helpText.text2}{' '}
      </Typography>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {helpText.text3} <DotsHorizontalSmallIcon /> {helpText.text3Cont}
      </Typography>
      <Typography variant="body1" className={classes.paragraphs}>
        {' '}
        {helpText.text4} <HistorySmallIcon className={classes.icon} /> {helpText.text4Cont}
      </Typography>
    </div>
  );
};

export default UseOfVebilder;
