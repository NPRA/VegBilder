import { makeStyles } from '@material-ui/core';
import CloseButton from 'components/CloseButton/CloseButton';
import PageInformationTextAndImage from 'components/PageInformationTextAndImage/PageInformationTextAndImage';
import React, { useState } from 'react';

const useStyles = makeStyles((theme) => ({
  information: {
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    top: '50%',
    left: '50%',
    minWidth: '50rem',
    maxHeight: '98vh',
    overflowY: 'auto',
    zIndex: 1000,
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    border: `1px solid ${theme.palette.common.grayDark}`,
    borderRadius: '0.5rem',
    padding: '0.2rem',
    marginTop: '1rem',
  },
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

  const webPageHeightInPixels = document.body.offsetHeight;
  const webPageWidthInPixels = document.body.offsetWidth;

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <div className={classes.information}>
      <CloseButton transparent={true} onClick={setVisible} />
      <div className={classes.content}>
        {!openForm ? <PageInformationTextAndImage /> : null}
        <div className={classes.rigthLeftText}>
          <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
            {openForm ? 'Lukk tilbakemeldingskjema' : 'Gi tilbakemelding'}
          </button>
          {/* <Typography variant="body1" className={classes.paragraphs}>
            {informationText.versionNumber}
          </Typography> */}
        </div>
        {openForm ? (
          <iframe
            title="tilbakemeldingsskjema"
            src={FORM_LINK}
            width={webPageWidthInPixels / 2}
            height={webPageHeightInPixels - 150} // iframe needs height and width in pixels.
            frameBorder="0"
            marginWidth={0}
            marginHeight={0}
            allowFullScreen
          />
        ) : null}
      </div>
    </div>
  );
};

export default PageInformation;
