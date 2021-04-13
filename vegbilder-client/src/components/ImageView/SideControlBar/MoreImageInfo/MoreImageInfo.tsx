import React, { useEffect, useState } from 'react';
import {
  IconButton,
  makeStyles,
  Paper,
  Popover,
  SvgIconTypeMap,
  Tooltip,
  Typography,
} from '@material-ui/core';

import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint, ILatlng } from 'types';
import { InformIcon } from 'components/Icons/Icons';
import { GetKommuneAndFylkeByLatLng } from 'apis/geonorge/getKommuneAndFylkeByLatLng';
import { getDistanceFromLatLonInKm } from 'utilities/latlngUtilities';
import GetVegObjektByVegsystemreferanseAndVegobjektid from 'apis/NVDB/getVegObjektByVegsystemreferanseAndVegobjektid';
import Theme from 'theme/Theme';
import MoreImageInfoButton from '../SideControlButtons/MoreImageInfoButton';
import { RoomOutlined, SpeedOutlined } from '@material-ui/icons';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.35rem',
    opacity: 0.8,
    borderRadius: '10px',
    maxHeight: '30vh',
    width: '18vw',
    backgroundColor: theme.palette.common.grayDarker,
    paddingBottom: '0.5rem',
  },
  infoHeaderContainer: {
    display: 'flex',
    flexDirection: 'row',
  },
  infoHeader: {
    alignSelf: 'center',
    justifySelf: 'center',
    textTransform: 'uppercase',
    opacity: 1,
    color: theme.palette.common.grayRegular,
  },
  itemGroupContainer: {
    backgroundColor: theme.palette.common.grayMedium,
    opacity: 0.9,
    width: '17vw',
    margin: '0.5rem auto 0 auto',
    borderRadius: '5px',
    padding: '0.3rem',
  },
  itemGroupHeader: {
    alignSelf: 'center',
    textTransform: 'uppercase',
    color: theme.palette.common.grayRegular,
    paddingLeft: '0.5rem',
  },
  lines: {
    padding: '0.3rem',
  },
  icon: {
    color: theme.palette.common.grayRegular,
    marigin: '0.5rem',
  },
}));

interface IMoreImageInfoProps {
  showInformation: boolean;
  setShowInformation: (value: boolean) => void;
  imagePoint: IImagePoint | null;
  disabled: boolean;
}

const MoreImageInfo = ({
  imagePoint,
  disabled,
  showInformation,
  setShowInformation,
}: IMoreImageInfoProps) => {
  const classes = useStyles();
  // const [detectedObjects, setDetectedObjects] = useState<{ [key: string]: string }>({});
  // const [detectedObjectsKeys, setDetectedObjectsKeys] = useState<string[]>([]);
  // const [strekningsnavn, setStrekningsnavn] = useState('');
  const [moreInfoAnchorEl, setMoreInfoAnchorEl] = useState<HTMLButtonElement | null>(null);
  const [fylkesNavn, setFylkesNavn] = useState('');
  const [kommuneNavn, setKommuneNavn] = useState('');
  const [position, setPosition] = useState<ILatlng>();
  const [distanceToNordkapp, setDistanceToNordkapp] = useState<string>();
  const [distanceToLindesnes, setDistanceToLindesnes] = useState<string>();
  const [fartsgrense, setFartsgrense] = useState(0);

  const fartsgrenseId = 105;
  const broId = 60;
  const tunnelId = 67;
  const trafikkmengdeId = 540;
  const kontraktsområdeId = 580;

  const getFartsgrense = async (imagePoint: IImagePoint) => {
    const vegsystemreferanse = getRoadReference(imagePoint)
      .withoutFelt.replace(/\s/g, '')
      .toLocaleLowerCase();
    await GetVegObjektByVegsystemreferanseAndVegobjektid(vegsystemreferanse, fartsgrenseId).then(
      (res) => {
        if (res && res.objekter.length) {
          const egenskaper = res.objekter[0].egenskaper ?? res.objekter.egenskaper;
          const fartsgrense = egenskaper.find((egenskap: any) => egenskap.navn === 'Fartsgrense');
          setFartsgrense(fartsgrense.verdi);
        }
      }
    );
  };

  // UTKOMMENTERT TIL DEN FLYTTER API
  // const getMoreInfoProps = async (jsonUrl: string) => {
  //   await getImageJsonFile(jsonUrl).then((res) => {
  //     if (res) {
  //       setStrekningsnavn(res.exif_strekningsnavn);
  //       const detekterteObjekter = res.detekterte_objekter;
  //       const keys = Object.keys(detekterteObjekter);
  //       setDetectedObjectsKeys(keys);
  //       setDetectedObjects(detekterteObjekter);
  //     }
  //   });
  // };

  // useEffect(() => {
  //   if (imagePoint) {
  //     const jsonUrl = getImageUrl(imagePoint).replace('jpg', 'json');
  //     getMoreInfoProps(jsonUrl);
  //   }
  // }, [imagePoint]);

  const getKommuneAndFylke = async (latlng: ILatlng) => {
    const response = await GetKommuneAndFylkeByLatLng(latlng);
    setFylkesNavn(response.fylkesnavn);
    setKommuneNavn(response.kommunenavn);
  };

  useEffect(() => {
    if (imagePoint) {
      const NordkappLatLng = { lat: 71.1652089, lng: 25.7909877 };
      const LindesnesLatLng = { lat: 57.9825904, lng: 7.0483913 };
      const imagePointLatlng = getImagePointLatLng(imagePoint);

      if (imagePoint.properties.AAR >= 2020) {
        getFartsgrense(imagePoint);
      } else setFartsgrense(0);

      if (imagePointLatlng) {
        getKommuneAndFylke(imagePointLatlng);
        setPosition(imagePointLatlng);
        const kmToLindesnes = getDistanceFromLatLonInKm(imagePointLatlng, LindesnesLatLng).toFixed(
          2
        );
        const kmToNordkapp = getDistanceFromLatLonInKm(imagePointLatlng, NordkappLatLng).toFixed(2);
        setDistanceToLindesnes(kmToLindesnes);
        setDistanceToNordkapp(kmToNordkapp);
      }
    }
  }, [imagePoint]);

  interface IItemGroupContainerProps {
    Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
    children: JSX.Element | JSX.Element[];
    headline?: string;
  }

  const ItemGroupContainer = ({ children, Icon, headline }: IItemGroupContainerProps) => {
    return (
      <Paper className={classes.itemGroupContainer}>
        <div className={classes.infoHeaderContainer}>
          <Icon className={classes.icon} />
          <Typography variant="subtitle2" className={classes.itemGroupHeader}>
            {' '}
            {headline}{' '}
          </Typography>
        </div>
        {children}
      </Paper>
    );
  };

  return (
    <Paper className={classes.infoContainer}>
      <div className={classes.infoHeaderContainer}>
        <MoreImageInfoButton
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={disabled}
        />
        <Typography variant="subtitle1" className={classes.infoHeader}>
          {' '}
          Info{' '}
        </Typography>
      </div>
      {imagePoint ? (
        <>
          {fylkesNavn.length && imagePoint.properties.FYLKENUMMER ? (
            <ItemGroupContainer headline="Plassering" Icon={RoomOutlined}>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`${fylkesNavn} (${imagePoint.properties.FYLKENUMMER}), ${kommuneNavn}`}
              </Typography>
            </ItemGroupContainer>
          ) : null}
          {fartsgrense > 0 ? (
            <ItemGroupContainer headline="Fartsgrense" Icon={SpeedOutlined}>
              <Typography
                variant="body1"
                className={classes.lines}
              >{`Fartsgrense: ${fartsgrense}km/h`}</Typography>
            </ItemGroupContainer>
          ) : null}
          {position ? (
            <ItemGroupContainer Icon={SpeedOutlined}>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Distanse til Nordkapp: ${distanceToNordkapp} km`}
              </Typography>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Distanse til Lindesnes: ${distanceToLindesnes} km`}
              </Typography>
            </ItemGroupContainer>
          ) : null}

          {/*
          <Typography variant="subtitle1" className={classes.lines}>
            Detekterte objekter
          </Typography>
           {detectedObjectsKeys.length ? (
            detectedObjectsKeys.map((key) => (
              <Typography variant="body1" className={classes.lines} key={key}>
                {`${key}: ${detectedObjects[key]} `}
              </Typography>
            ))
          ) : (
            <Typography variant="body1" className={classes.lines}>
              Ingen
            </Typography>
          )} */}
        </>
      ) : null}
    </Paper>
  );
};

export default MoreImageInfo;
