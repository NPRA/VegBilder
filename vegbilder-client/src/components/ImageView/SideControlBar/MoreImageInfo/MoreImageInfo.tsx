import React, { FunctionComponent, SetStateAction, SVGProps, useEffect, useState } from 'react';
import { makeStyles, Paper, SvgIconTypeMap, Typography } from '@material-ui/core';

import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint, ILatlng } from 'types';
import { GetKommuneAndFylkeByLatLng } from 'apis/geonorge/getKommuneAndFylkeByLatLng';
import { getDistanceFromLatLonInKm } from 'utilities/latlngUtilities';
import GetVegObjektByVegsystemreferanseAndVegobjektid from 'apis/NVDB/getVegObjektByVegsystemreferanseAndVegobjektid';
import MoreImageInfoButton from '../SideControlButtons/MoreImageInfoButton';
import { CommuteOutlined, RoomOutlined, SpeedOutlined } from '@material-ui/icons';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { ContractIcon, DistanceToIcon, SladdetIcon } from 'components/Icons/Icons';
import GetVeglenkesekvenserByVegsystemreferanse from 'apis/NVDB/getVeglenkesekvenserByVegsystemreferanse';

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.35rem',
    opacity: 0.8,
    borderRadius: '10px',
    backgroundColor: theme.palette.common.grayDarker,
    paddingBottom: '0.5rem',
  },
  scrollContainer: {
    maxHeight: '30vh',
    overflowY: 'scroll',
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
    color: theme.palette.common.grayRegular,
  },
  icon: {
    color: theme.palette.common.grayRegular,
    marigin: '0.5rem',
  },
  informationLines: {
    marginLeft: '2rem',
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
  const [fylkesNavn, setFylkesNavn] = useState('');
  const [kommuneNavn, setKommuneNavn] = useState('');
  const [position, setPosition] = useState<ILatlng>();
  const [distanceToNordkapp, setDistanceToNordkapp] = useState<string>();
  const [distanceToLindesnes, setDistanceToLindesnes] = useState<string>();
  const [fartsgrense, setFartsgrense] = useState<(string | number)[]>([]);
  const [trafikkMengde, setTrafikkMengde] = useState<string[]>([]);
  const [kontraktsområder, setKontraktsområder] = useState<string[]>([]);
  const [gatenavn, setGatenavn] = useState<string>();
  const [broNavn, setBroNavn] = useState<(string | number)[]>([]);
  const [tunnelNavn, setTunnelNavn] = useState<(string | number)[]>([]);

  const fartsgrenseId = 105;
  const broId = 60;
  const tunnelId = 67;
  const trafikkmengdeId = 540;

  const trimmedVegsystemreferanse = (imagePoint: IImagePoint) => {
    return getRoadReference(imagePoint).withoutFelt.replace(/\s/g, '').toLocaleLowerCase();
  };

  const setResourceStateByEgenskapAndResourceId = async (
    imagePoint: IImagePoint,
    resourceId: number,
    egenskap_: string,
    setState: (state: (number | string)[]) => void
  ) => {
    await GetVegObjektByVegsystemreferanseAndVegobjektid(
      trimmedVegsystemreferanse(imagePoint),
      resourceId
    ).then((res) => {
      if (res && res.objekter.length) {
        const resource: (string | number)[] = [];
        res.objekter.forEach((obj: any) => {
          const egenskaper = obj.egenskaper;
          const egenskap = egenskaper.find((egenskap: any) => egenskap.navn === egenskap_);
          resource.push(egenskap.verdi);
        });
        setState(resource);
      } else {
        setState([]);
      }
    });
  };

  const getTrafikkMengde = async (imagePoint: IImagePoint) => {
    await GetVegObjektByVegsystemreferanseAndVegobjektid(
      trimmedVegsystemreferanse(imagePoint),
      trafikkmengdeId
    ).then((res) => {
      if (res && res.objekter.length) {
        const trafikk: string[] = [];
        res.objekter.forEach((obj: any) => {
          const egenskaper = obj.egenskaper;
          const trafikkMengdeÅr = egenskaper.find(
            (egenskap: any) => egenskap.navn === 'År, gjelder for'
          );
          const totalTrafikkmengde = egenskaper.find(
            (egenskap: any) => egenskap.navn === 'ÅDT, total'
          );
          trafikk.push(`ÅDT total, ${trafikkMengdeÅr.verdi}: ${totalTrafikkmengde.verdi}`);
        });
        setTrafikkMengde(trafikk);
      } else {
        setTrafikkMengde([]);
      }
    });
  };

  const getGateNavnAndKontraktsområder = async (imagePoint: IImagePoint) => {
    await GetVeglenkesekvenserByVegsystemreferanse(trimmedVegsystemreferanse(imagePoint)).then(
      (res) => {
        if (res && res.objekter.length) {
          const kontraktsområder_: string[] = [];
          res.objekter.forEach((obj: any) => {
            const kontraktsområder = obj.kontraktsområder;
            kontraktsområder.forEach((kontraktsområde: any) => {
              kontraktsområder_.push(kontraktsområde.navn);
            });
            const gate = obj.gate;
            if (gate) {
              setGatenavn(gate.navn);
            }
          });
          setKontraktsområder(kontraktsområder_);
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
    setKommuneNavn(`${response.kommunenavn} (${response.kommunenummer})  `);
  };

  useEffect(() => {
    if (imagePoint) {
      const NordkappLatLng = { lat: 71.1652089, lng: 25.7909877 };
      const LindesnesLatLng = { lat: 57.9825904, lng: 7.0483913 };
      const imagePointLatlng = getImagePointLatLng(imagePoint);

      if (imagePoint.properties.AAR >= 2020) {
        setResourceStateByEgenskapAndResourceId(
          imagePoint,
          fartsgrenseId,
          'Fartsgrense',
          setFartsgrense
        );
        setResourceStateByEgenskapAndResourceId(imagePoint, broId, 'Navn', setBroNavn);
        setResourceStateByEgenskapAndResourceId(imagePoint, tunnelId, 'Navn', setTunnelNavn);
        getTrafikkMengde(imagePoint);
        getGateNavnAndKontraktsområder(imagePoint);
      } else {
        setBroNavn([]);
        setFartsgrense([]);
        setGatenavn(undefined);
        setTunnelNavn([]);
        setTrafikkMengde([]);
        setKontraktsområder([]);
      }

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
    Icon:
      | OverridableComponent<SvgIconTypeMap<{}, 'svg'>>
      | FunctionComponent<SVGProps<SVGSVGElement>>;
    children: JSX.Element | JSX.Element[] | void[] | any;
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
        <div className={classes.informationLines}>{children}</div>
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
        <div className={classes.scrollContainer}>
          {fylkesNavn.length && imagePoint.properties.FYLKENUMMER ? (
            <ItemGroupContainer headline="Plassering" Icon={RoomOutlined}>
              {gatenavn ? (
                <Typography variant="body1" className={classes.lines}>
                  {gatenavn}
                </Typography>
              ) : null}
              {broNavn.length ? (
                <Typography variant="body1" className={classes.lines}>
                  {`Bronavn: ${broNavn}`}
                </Typography>
              ) : null}
              {tunnelNavn.length ? (
                <Typography variant="body1" className={classes.lines}>
                  {`${tunnelNavn[0]}`}
                </Typography>
              ) : null}
              <Typography variant="body1" className={classes.lines}>
                {`${fylkesNavn} (${imagePoint.properties.FYLKENUMMER})`}
              </Typography>
              <Typography variant="body1" className={classes.lines}>
                {`${kommuneNavn}`}
              </Typography>
            </ItemGroupContainer>
          ) : null}
          {fartsgrense.length ? (
            <ItemGroupContainer headline="Fartsgrense" Icon={SpeedOutlined}>
              {fartsgrense.map((fart) => (
                <Typography variant="body1" className={classes.lines}>{`${fart}km/h`}</Typography>
              ))}
            </ItemGroupContainer>
          ) : null}
          {trafikkMengde.length ? (
            <ItemGroupContainer headline="Trafikkmengde" Icon={CommuteOutlined}>
              {trafikkMengde.map((trafikkMengdeItem) => (
                <Typography variant="body1" className={classes.lines}>
                  {trafikkMengdeItem}
                </Typography>
              ))}
            </ItemGroupContainer>
          ) : null}
          <ItemGroupContainer headline="Sladdet objekter" Icon={SladdetIcon}>
            <Typography variant="body1" className={classes.lines}>{`ÅDT: 200`}</Typography>
          </ItemGroupContainer>
          {kontraktsområder.length ? (
            <ItemGroupContainer headline="Kontraktsområder" Icon={ContractIcon}>
              {kontraktsområder.map((kontraktsområde) => (
                <Typography
                  variant="body1"
                  className={classes.lines}
                >{`${kontraktsområde}`}</Typography>
              ))}
            </ItemGroupContainer>
          ) : null}
          {position ? (
            <ItemGroupContainer Icon={DistanceToIcon} headline="nordkapp, lindesnes">
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`${distanceToNordkapp} km,  ${distanceToLindesnes} km`}
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
        </div>
      ) : null}
    </Paper>
  );
};

export default MoreImageInfo;
