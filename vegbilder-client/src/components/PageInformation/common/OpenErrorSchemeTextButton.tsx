import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';
import {useTranslation} from "react-i18next";

import { REPORT_ERROR_SCHEME_URL } from 'constants/urls';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';

const useStyles = makeStyles((theme) => ({
  openFeedbackScheme: {
    position: 'sticky',
    border: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `1px solid ${theme.palette.common.grayRegular}`,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '1rem',
    '&:hover': {
      color: theme.palette.common.orangeDark,
      borderBottom: `1px solid ${theme.palette.common.orangeDark}`,
    },
  },
}));

interface IOpenErrorSchemeTextButtonProps {
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
}

const OpenErrorSchemeTextButton = ({ openForm, setOpenForm }: IOpenErrorSchemeTextButtonProps) => {
  const classes = useStyles();
  const { t } = useTranslation('pageInformation', {keyPrefix: "tilbakemeldingsskjemaFeil"});

  return (
    <>
      <Typography variant="body1">
        {!openForm ? t('text1') : ''}
        <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
          {openForm ? t('buttonText1') : t('buttonText2')}
        </button>{' '}
        {!openForm ? t('text2') : ''}
      </Typography>
      {openForm ? <FeedbackFormFrame formLink={REPORT_ERROR_SCHEME_URL} /> : null}
    </>
  );
};

export default OpenErrorSchemeTextButton;
