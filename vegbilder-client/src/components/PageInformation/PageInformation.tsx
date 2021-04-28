import React, { useState } from 'react';
import { Button, Divider, makeStyles } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import UseOfVebilder from './tabs/UseOfVegbilder';
import VersionLog from './tabs/VersionLog';
import Theme from 'theme/Theme';
import About from './tabs/About';
import Gdpr from './tabs/Gdpr';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { FEEDBACK_SCHEME_URL } from 'constants/urls';

const useStyles = makeStyles(() => ({
  content: {
    padding: '2rem 2rem 1rem 2rem',
  },
  paragraphs: {
    paddingBottom: '1rem',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'space-between',
  },
}));

interface IInformationProps {
  setVisible: () => void;
  isOnboarding?: boolean;
}

const PageInformation = ({ setVisible, isOnboarding }: IInformationProps) => {
  const classes = useStyles();
  const [selectedTab, setSelectedTab] = useState('Om Vegbilder');

  const tabs = ['Om', 'Bruk', 'GDPR', 'Tilbakemelding', 'Versjonslogg'];

  const getComponentByTab = (tab: string) => {
    if (tab === 'Bruk') {
      return <UseOfVebilder />;
    } else if (tab === 'Versjonslogg') {
      return <VersionLog />;
    } else if (tab === 'GDPR') {
      return <Gdpr />;
    } else if (tab === 'Tilbakemelding') {
      return <FeedbackFormFrame formLink={FEEDBACK_SCHEME_URL} />;
    }
    return <About />;
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
