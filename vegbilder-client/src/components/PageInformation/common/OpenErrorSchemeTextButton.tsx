import React from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import { REPORT_ERROR_SCHEME_URL } from 'constants/urls';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';

const useStyles = makeStyles((theme) => ({
  openFeedbackScheme: {
    position: 'sticky',
    border: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `0.5px solid ${theme.palette.common.charcoalLighter}`,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    padding: 0,
    marginBottom: '1rem',
    '&:hover': {
      color: theme.palette.common.orangeDark,
      borderBottom: `0.5px solid ${theme.palette.common.orangeDark}`,
    },
  },
}));

interface IOpenErrorSchemeTextButtonProps {
  openForm: boolean;
  setOpenForm: (open: boolean) => void;
}

const OpenErrorSchemeTextButton = ({ openForm, setOpenForm }: IOpenErrorSchemeTextButtonProps) => {
  const classes = useStyles();

  return (
    <>
      <Typography variant="body1">
        {!openForm ? 'Eventuelle feil sendes inn i eget ' : ''}
        <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
          {openForm ? 'Lukk feilmeldingskjema' : ' skjema'}
        </button>{' '}
        {!openForm ? ' eller med menyvalget «Flere funksjoner» under valgt bilde.' : ''}
      </Typography>
      {openForm ? <FeedbackFormFrame formLink={REPORT_ERROR_SCHEME_URL} /> : null}
    </>
  );
};

export default OpenErrorSchemeTextButton;
