import React, { useState } from 'react';
import { Button, Divider, makeStyles, Typography } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { helpText } from 'constants/text';
import { DotsHorizontalSmallIcon } from 'components/Icons/Icons';
import { FEEDBACK_SCHEME_URL } from 'constants/urls';
import PageInformationTextAndImage from 'components/Onboarding/PageInformationTextAndImage/PageInformationTextAndImage';
import UseOfVebilder from './tabs/UseOfVegbilder';
import VersionLog from './tabs/VersionLog';
import Theme from 'theme/Theme';

const useStyles = makeStyles((theme) => ({
  content: {
    margin: '2rem 2rem 1rem 2rem',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  openFeedbackScheme: {
    position: 'sticky',
    border: 'none',
    background: 'inherit',
    color: 'inherit',
    borderBottom: `0.5px solid ${theme.palette.common.grayRegular}`,
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
  icon: {
    width: '0.8rem',
    height: '0.8rem',
    margin: '0 0.1rem',
  },
  tabs: {
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
  const [selectedTab, setSelectedTab] = useState('Om Vegbilder');

  const tabs = ['Om Vegbilder', 'Bruk av vegbilder', 'Versjonslogg', 'Anonymisering'];

  const getComponentByTab = (tab: string) => {
    if (tab === 'Bruk av vegbilder') {
      return <UseOfVebilder />;
    } else if (tab === 'Versjonslogg') {
      return <VersionLog />;
    }
    return (
      <>
        {!openForm ? (
          <>
            <Typography variant="h2"> Om Vegbilder</Typography>
            <PageInformationTextAndImage />{' '}
            <Typography variant="h3" className={classes.paragraphs}>
              {' '}
              {helpText.header2}
            </Typography>
            <Typography className={classes.paragraphs} variant="body1">
              {helpText.text5} <DotsHorizontalSmallIcon />
              {' .'}
            </Typography>{' '}
          </>
        ) : null}
        <button className={classes.openFeedbackScheme} onClick={() => setOpenForm(!openForm)}>
          {openForm ? 'Lukk tilbakemeldingskjema' : 'Gi tilbakemelding'}
        </button>
        {openForm ? <FeedbackFormFrame formLink={FEEDBACK_SCHEME_URL} /> : null}
      </>
    );
  };

  return (
    <PopUpWrapper setVisible={setVisible}>
      <div className={classes.content}>
        {getComponentByTab(selectedTab)}
        <Divider />
        <div className={classes.tabs}>
          {tabs.map((tab) => (
            <Button
              style={{ color: tab === selectedTab ? Theme.palette.common.orangeDark : '' }}
              onClick={() => setSelectedTab(tab)}
            >
              {tab}
            </Button>
          ))}
        </div>
      </div>
    </PopUpWrapper>
  );
};

export default PageInformation;
