import React from 'react';
import { makeStyles } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';

const useStyles = makeStyles(() => ({
  content: {
    margin: '2rem 2rem 2rem 2rem',
  },
}));

interface IFeedbackProps {
  setVisible: () => void;
}

const ReportErrorFeedback = ({ setVisible }: IFeedbackProps) => {
  const classes = useStyles();

  console.log('hello');

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <PopUpWrapper setVisible={setVisible}>
      <div className={classes.content}>
        <FeedbackFormFrame formLink={FORM_LINK} />
      </div>
    </PopUpWrapper>
  );
};

export default ReportErrorFeedback;
