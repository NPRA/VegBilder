import React, { useState } from 'react';
import { Button, Divider, makeStyles } from '@material-ui/core';
import { useTranslation } from "react-i18next";

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import UseOfVebilder from './tabs/UseOfVegbilder';
import Teknisk from './tabs/Teknisk/Teknisk';
import Theme from 'theme/Theme';
import About from './tabs/About';
import Gdpr from './tabs/Gdpr';
import FeedbackFormFrame from 'components/FeedbackFormFrame/FeedbackFormFrame';
import { FEEDBACK_SCHEME_URL } from 'constants/urls';

const useStyles = makeStyles(() => ({
  content: {
    padding: '2rem 2rem 1rem 2rem',
    display: 'flex',
    flexDirection: 'column',
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
}

const PageInformation = ({ setVisible }: IInformationProps) => {
  const classes = useStyles();
  const { t } = useTranslation('pageInformation', {keyPrefix: "tabs"});
  const [selectedTab, setSelectedTab] = useState('Om');

  const tabs = [t('om'), t('bruk'), t('GDPR'), t('tilbakemelding'), t('teknisk')];

  const getComponentByTab = (tab: string) => {
    if (tab === t('bruk')) {
      return <UseOfVebilder />;
    } else if (tab === t('teknisk')) {
      return <Teknisk />;
    } else if (tab === t('GDPR')) {
      return <Gdpr />;
    } else if (tab === t('tilbakemelding')) {
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
              key={tab}
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
