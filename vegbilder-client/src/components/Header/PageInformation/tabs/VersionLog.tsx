import React, { useState } from 'react';
import { Divider, makeStyles, Typography } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { helpText } from 'constants/text';
import { DotsHorizontalSmallIcon, HistorySmallIcon } from 'components/Icons/Icons';
import { FEEDBACK_SCHEME_URL } from 'constants/urls';
import { currentVersion, versionLog } from 'constants/versions';

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
  bullets: {
    color: theme.palette.common.grayRegular,
  },
}));

const VersionLog = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h2"> Versjonslogg </Typography>
      {Object.entries(versionLog).map(([versionNumber, changes]) => (
        <>
          <Typography variant="subtitle1"> {versionNumber} </Typography>
          <ul className={classes.bullets}>
            {changes.map((change) => (
              <li>{change}</li>
            ))}
          </ul>
        </>
      ))}
    </>
  );
};

export default VersionLog;
