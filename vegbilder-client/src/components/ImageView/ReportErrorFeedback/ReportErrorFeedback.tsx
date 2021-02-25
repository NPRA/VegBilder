import React from 'react';
import { makeStyles } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { REPORT_ERROR_SCHEME_URL } from 'constants/urls';

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
  return (
    <PopUpWrapper setVisible={setVisible}>
      <div className={classes.content}>
        <FeedbackFormFrame formLink={REPORT_ERROR_SCHEME_URL} />
      </div>
    </PopUpWrapper>
  );
};

export default ReportErrorFeedback;
