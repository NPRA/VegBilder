import { makeStyles, Typography } from '@material-ui/core';
import CloseButton from 'components/CloseButton/CloseButton';
import { informationText } from 'constants/text';
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
    margin: '2rem 2rem 0 2rem',
  },
  headline: {
    textAlign: 'center',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  image: {
    display: 'block',
    margin: 'auto auto',
    padding: '1rem 0 0 0',
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
  footerText: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

interface IInformationProps {
  setVisible: () => void;
  isOnboarding?: boolean;
  showMessage: (message: string) => void;
}

const PageInformation = ({ setVisible, isOnboarding }: IInformationProps) => {
  const classes = useStyles(isOnboarding);
  const [openForm, setOpenForm] = useState(false);

  const FORM_LINK =
    'https://forms.office.com/Pages/ResponsePage.aspx?id=VGmFOFXt90mL3XOP-7_TkIgX88vaXV9Notkd5xXWTp5UOVIzNlE0T1hMUVk0N1ZDSzVIMkcyTk84VCQlQCN0PWcu';

  return (
    <div className={isOnboarding ? '' : classes.information}>
      <CloseButton transparent={true} onClick={setVisible} />
      <div className={classes.content}>
        {!openForm ? (
          <>
            <Typography variant="h2" className={classes.headline}>
              {' '}
              {informationText.header}{' '}
            </Typography>
            <img
              src={`${process.env.PUBLIC_URL}/images/E6-Dovrefjell-Snohetta-lower.jpg`}
              alt="Bilde av E6 ved Dovrefjell Snøhetta"
              width="100%"
              className={classes.image}
            />
            <Typography variant="body1" className={classes.paragraphs}>
              {' '}
              {informationText.photoBy}{' '}
            </Typography>
            <Typography variant="body1" className={classes.paragraphs}>
              {' '}
              {informationText.text}{' '}
            </Typography>

            <Typography variant="body1" className={classes.paragraphs}>
              {' '}
              {informationText.text2}{' '}
            </Typography>
          </>
        ) : null}
        <>
          <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
            {openForm ? 'Lukk tilbakemeldingskjema' : 'Gi tilbakemelding'}
          </button>
          {openForm ? (
            <iframe
              title="tilbakemeldingsskjema"
              src={FORM_LINK}
              width="1000px"
              height="1200px"
              frameBorder="0"
              marginWidth={0}
              marginHeight={0}
              style={{ border: 'none', maxWidth: '100%', maxHeight: '100vh' }}
              allowFullScreen
            />
          ) : (
            <div className={classes.footerText}>
              <Typography variant="body1" className={classes.paragraphs}>
                {informationText.contact}
                {informationText.email}
              </Typography>
              <Typography variant="body1" className={classes.paragraphs}>
                {informationText.versionNumber}
              </Typography>
            </div>
          )}
        </>
      </div>
    </div>
  );
};

export default PageInformation;
