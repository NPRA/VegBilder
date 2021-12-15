import React, { Suspense } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { StatisticsTable } from './StatisticsTable/StatisticsTable';

import { versionLog } from 'constants/versions';
import { tekniskText } from 'constants/text';

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

const Teknisk = () => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="h4" className={classes.paragraphs}>
        {tekniskText.header}
      </Typography>

      <div className={classes.scrollContainer}>
        <Typography variant="subtitle1"> {tekniskText.subheader1} </Typography>
        <ul className={classes.bullets}>
          <li>
            <Typography variant="body1">
              {' '}
              {tekniskText.text1}
              <a
                target="_blank"
                className={classes.link}
                rel="noopener noreferrer"
                href="https://www.geonorge.no"
              >
                {' '}
                Geonorge{' '}
              </a>
            </Typography>
          </li>
          <li>
            <Typography variant="body1" className={classes.paragraphs}>
              {tekniskText.text2}
              <a
                target="_blank"
                className={classes.link}
                rel="noopener noreferrer"
                href="https://www.vegvesen.no/fag/teknologi/nasjonal+vegdatabank"
              >
                {' '}
                NVDB{' '}
              </a>
            </Typography>
          </li>
        </ul>
        <Typography variant="subtitle1"> Bilder i løsningen </Typography>
        <Typography variant="body1" > Tabellen under gir en oversikt over hvor mange vegbilder som er tilgjengelige, sortert etter år og vegkategori. </Typography>
        {/* We have to use suspense here, or else the Suspense surrounding the entire app would kick in while loading the statistics (with recoil), 
              briefly showing a white screen with a spinner */}
        <Suspense fallback={<Typography variant="body1" style={{ textAlign: 'center', paddingTop: '10px', zIndex: 10 }}>Henter statistikk ...</Typography>}>
          <StatisticsTable />
        </Suspense>
        <Typography variant="subtitle1"> {tekniskText.subheader2} </Typography>
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

export default Teknisk;
