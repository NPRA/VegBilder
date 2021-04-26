import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { versionLog } from 'constants/versions';

const useStyles = makeStyles((theme) => ({
  bullets: {
    color: theme.palette.common.grayRegular,
  },
  scrollContainer: {
    overflowY: 'auto',
    padding: '1rem 0',
    maxHeight: '60vh',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
}));

const VersionLog = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h2"> Versjonslogg </Typography>
      <div className={classes.scrollContainer}>
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
      </div>
    </>
  );
};

export default VersionLog;
