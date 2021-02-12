import { makeStyles } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const useStyles = makeStyles((theme) => ({
  link: {
    border: 'none',
    textDecoration: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `1px solid ${theme.palette.common.charcoalLighter}`,
    fontFamily: 'inherit',
    fontSize: 'inherit',
    cursor: 'pointer',
    padding: 0,
  },
}));

interface IFeedbackProps {
  title: string;
}

export const FeedbackLink = ({ title }: IFeedbackProps) => {
  const classes = useStyles();

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <a className={classes.link} href={`${FORM_LINK}`} target="_blank" rel="noopener noreferrer">
      {title}
    </a>
  );
};

export default FeedbackLink;
