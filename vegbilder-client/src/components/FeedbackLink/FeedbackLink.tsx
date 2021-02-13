import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(() => ({
  link: {
    color: 'inherit',
    cursor: 'pointer',
    padding: 0,
    textDecoration: 'none',
  },
}));

interface IFeedbackProps {
  children: React.ReactChildren;
}

export const FeedbackLink = ({ children }: IFeedbackProps) => {
  const classes = useStyles();

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <a className={classes.link} href={`${FORM_LINK}`} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

export default FeedbackLink;
