import React, { useState } from 'react';
import { makeStyles, Typography } from '@material-ui/core';

import PageInformationTextAndImage from 'components/PageInformationTextAndImage/PageInformationTextAndImage';
import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { informationText } from 'constants/text';
import { DotsHorizontalSmallIcon } from 'components/Icons/Icons';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: '2rem 2rem 2rem 2rem',
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
}));

interface IInformationProps {
  setVisible: () => void;
}

const PageInformation = ({ setVisible }: IInformationProps) => {
  const classes = useStyles();
  const [openForm, setOpenForm] = useState(false);

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <PopUpWrapper setVisible={setVisible}>
      <div className={classes.content}>
        {!openForm ? (
          <>
            <PageInformationTextAndImage />
            <Typography className={classes.paragraphs} variant="body1">
              {informationText.text4} <DotsHorizontalSmallIcon />
              {' ".'}
            </Typography>{' '}
          </>
        ) : null}
        <div className={classes.rigthLeftText}>
          <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
            {openForm ? 'Lukk tilbakemeldingskjema' : 'Gi tilbakemelding'}
          </button>
          <Typography variant="body1" className={classes.paragraphs}>
            {openForm ? '' : informationText.versionNumber}
          </Typography>
        </div>
        {openForm ? <FeedbackFormFrame formLink={FORM_LINK} /> : null}
      </div>
    </PopUpWrapper>
  );
};

export default PageInformation;
