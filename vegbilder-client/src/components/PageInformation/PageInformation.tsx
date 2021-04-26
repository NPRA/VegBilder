import React, { useState } from 'react';
import { Button, Divider, makeStyles, Typography } from '@material-ui/core';

import PopUpWrapper from 'components/wrappers/PopUpWrapper';
import UseOfVebilder from './tabs/UseOfVegbilder';
import VersionLog from './tabs/VersionLog';
import Theme from 'theme/Theme';
import About from './tabs/About';

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

  const tabs = ['Om Vegbilder', 'Bruk av vegbilder', 'Versjonslogg', 'Anonymisering'];

  const getComponentByTab = (tab: string) => {
    if (tab === 'Bruk av vegbilder') {
      return <UseOfVebilder />;
    } else if (tab === 'Versjonslogg') {
      return <VersionLog />;
    } else if (tab === 'Anonymisering') {
      return (
        <>
          <Typography variant="h2"> Anonymisering</Typography>
          <Typography variant="body1" className={classes.paragraphs}>
            Ikke implementert enda.
          </Typography>
        </>
      );
    }
    return <About isOnboarding={isOnboarding} />;
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
