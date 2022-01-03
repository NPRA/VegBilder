import React, { Suspense } from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import { StatisticsTable } from './StatisticsTable/StatisticsTable';

import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation('pageInformation');

  return (
    <>
      <Typography variant="h4" className={classes.paragraphs}>
      {t('teknisk.header')}
      </Typography>

      <div className={classes.scrollContainer}>
        <Typography variant="subtitle1"> {t('teknisk.subheader1')} </Typography>
        <ul className={classes.bullets}>
          <li>
            <Typography variant="body1">
              {' '}
              {t('teknisk.text1')}
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
            {t('teknisk.text2')}
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
        <Typography variant="subtitle1"> {t('teknisk.statistics.header')} </Typography> 
        <Typography variant="body1" > {t('teknisk.statistics.description')} </Typography>
        {/* We have to use suspense here, or else the Suspense surrounding the entire app would kick in while loading the statistics (with recoil), 
              briefly showing a white screen with a spinner */}
        <Suspense fallback={<Typography variant="body1" style={{ textAlign: 'center', paddingTop: '10px', zIndex: 10 }}>{t('teknisk.statistics.loading')}</Typography>}>
          <StatisticsTable />
        </Suspense>
        <Typography variant="subtitle1"> {t('versjonslogg.header')} </Typography>
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
