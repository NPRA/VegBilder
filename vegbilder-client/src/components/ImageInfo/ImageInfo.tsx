import React, { FunctionComponent, SVGProps, useEffect, useState } from 'react';
import { makeStyles, Paper, SvgIconTypeMap, Typography } from '@material-ui/core';

import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint, ILatlng } from 'types';
import { GetKommuneAndFylkeByLatLng } from 'apis/geonorge/getKommuneAndFylkeByLatLng';
import { getDistanceFromLatLonInKm } from 'utilities/latlngUtilities';
import GetVegObjektByVegsystemreferanseAndVegobjektid from 'apis/NVDB/getVegObjektByVegsystemreferanseAndVegobjektid';
import ImageInfoButton from './ImageInfoButton';
import { CommuteOutlined, RoomOutlined, SpeedOutlined } from '@material-ui/icons';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import { ContractIcon, DistanceToIcon, SladdetIcon } from 'components/Icons/Icons';
import GetVeglenkesekvenserByVegsystemreferanse from 'apis/NVDB/getVeglenkesekvenserByVegsystemreferanse';
import GetPositionDataByLatLng from 'apis/NVDB/getPositionDataByLatLng';

const useStyles = makeStyles((theme) => ({
  infoContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: '0.35rem',
    borderRadius: '10px',
    background: 'rgba(46, 53, 57, 0.80)',
    paddingBottom: '0.5rem',
    minHeight: '5%',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
  },
  scrollContainer: {
    overflowY: 'auto',
    overflowX: 'hidden',
    padding: '0 0.5rem',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
      borderRadius: '10px',
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '10px',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
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
    background: 'rgba(69,81,90, 0.80)',
    width: '95%',
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
  detectedObjects: {
    display: 'flex',
  },
  detectedObjectFrame: {
    border: `1px solid ${theme.palette.common.grayRegular}`,
    borderRadius: '5px',
    padding: '0 0.2rem',
    margin: '0.1rem 0.2rem 0.1rem 0',
  },
  NordkappLindesnesHeader: {
    display: 'flex',
    flexDirection: 'row',
    marginRight: '0.5rem',
  },
  NordkappLindesnesHeaderWord: {
    width: '4.5rem',
    alignSelf: 'center',
    textTransform: 'uppercase',
    margin: '0 1.5rem 0 0.5rem',
    color: theme.palette.common.grayRegular,
  },
  NordkappLindesnesWord: {
    width: '4.5rem',
    alignSelf: 'center',
    margin: '0 1.5rem 0 0.5rem',
    color: theme.palette.common.grayRegular,
  },
}));

interface IImageInfoProps {
  showInformation: boolean;
  setShowInformation: (value: boolean) => void;
  imagePoint: IImagePoint | null;
  disabled?: boolean;
  maxHeight: string;
}

const ImageInfo = ({
  imagePoint,
  disabled,
  showInformation,
  setShowInformation,
  maxHeight,
}: IImageInfoProps) => {
  const classes = useStyles();
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
  const [vegsystemreferanse, setVegsystemReferanse] = useState('');

  const fartsgrenseId = 105;
  const broId = 60;
  const tunnelId = 67;
  const trafikkmengdeId = 540;

  const getTrimmedVegsystemreferanse = (imagePoint: IImagePoint) => {
    return getRoadReference(imagePoint).withoutFelt.replace(/\s/g, '').toLocaleLowerCase();
  };

  const setResourceStateByEgenskapAndResourceId = async (
    trimmedVegsystemreferanse: string,
    resourceId: number,
    egenskap_: string,
    setState: (state: (number | string)[]) => void
  ) => {
    await GetVegObjektByVegsystemreferanseAndVegobjektid(
      trimmedVegsystemreferanse,
      resourceId
    ).then((res) => {
      if (res && res.objekter.length) {
        const resource: (string | number)[] = [];
        res.objekter.forEach((obj: any) => {
          const egenskaper = obj.egenskaper;
          const egenskap = egenskaper.find((egenskap: any) => egenskap.navn === egenskap_);
          resource.push(`${egenskap.verdi}`);
        });
        setState(resource);
      } else {
        setState([]);
      }
    });
  };

  const getTrafikkMengde = async (trimmedVegsystemreferanse: string) => {
    await GetVegObjektByVegsystemreferanseAndVegobjektid(
      trimmedVegsystemreferanse,
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

  const getGateNavnAndKontraktsområder = async (trimmedVegsystemreferanse: string) => {
    await GetVeglenkesekvenserByVegsystemreferanse(trimmedVegsystemreferanse).then((res) => {
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
    });
  };

  const getKommuneAndFylke = async (latlng: ILatlng) => {
    const response = await GetKommuneAndFylkeByLatLng(latlng);
    setFylkesNavn(response.fylkesnavn);
    setKommuneNavn(`${response.kommunenavn} (${response.kommunenummer})  `);
  };

  const getAndSetPropertiesFromNvdb = (trimmedVegsystemreferanse: string) => {
    setResourceStateByEgenskapAndResourceId(
      trimmedVegsystemreferanse,
      fartsgrenseId,
      'Fartsgrense',
      setFartsgrense
    );
    setResourceStateByEgenskapAndResourceId(trimmedVegsystemreferanse, broId, 'Navn', setBroNavn);
    setResourceStateByEgenskapAndResourceId(
      trimmedVegsystemreferanse,
      tunnelId,
      'Navn',
      setTunnelNavn
    );
    getTrafikkMengde(trimmedVegsystemreferanse);
    getGateNavnAndKontraktsområder(trimmedVegsystemreferanse);
  };

  const getVegsystemReferanseAndSetNvdPropsForOldYears = async (
    latlng: ILatlng,
    imagePoint: IImagePoint
  ) => {
    await GetPositionDataByLatLng(latlng).then((res) => {
      const vegsytemreferanseWithSameVegkategori = res.find(
        (res: any) =>
          res.vegsystemreferanse.vegsystem.vegkategori === imagePoint.properties.VEGKATEGORI
      );
      if (vegsytemreferanseWithSameVegkategori) {
        const trimmedVegsystemreferanse = vegsytemreferanseWithSameVegkategori.vegsystemreferanse.kortform.replace(
          /\s/g,
          ''
        );
        setVegsystemReferanse(vegsytemreferanseWithSameVegkategori.vegsystemreferanse.kortform);
        getAndSetPropertiesFromNvdb(trimmedVegsystemreferanse);
      }
    });
  };

  const getDetectedObjectsJson = (imagePoint: IImagePoint) => {
    if (imagePoint.properties.DETEKTERTEOBJEKTER) {
      const detectedObjectsJson = JSON.parse(imagePoint.properties.DETEKTERTEOBJEKTER);
      return detectedObjectsJson;
    }
  };

  const getNumberOfDetectedObjects = (imagePoint: IImagePoint) => {
    const detectedObjJson = getDetectedObjectsJson(imagePoint);
    let n = 0;
    for (let prop in detectedObjJson) {
      n += parseInt(detectedObjJson[prop]);
    }
    return n;
  };

  useEffect(() => {
    if (imagePoint) {
      const NordkappLatLng = { lat: 71.1652089, lng: 25.7909877 };
      const LindesnesLatLng = { lat: 57.9825904, lng: 7.0483913 };
      const imagePointLatlng = getImagePointLatLng(imagePoint);

      if (imagePoint.properties.AAR >= 2020) {
        setVegsystemReferanse(getRoadReference(imagePoint).withoutFelt);
        const trimmedVegsystemreferanse = getTrimmedVegsystemreferanse(imagePoint);
        getAndSetPropertiesFromNvdb(trimmedVegsystemreferanse);
      } else {
        if (imagePointLatlng)
          getVegsystemReferanseAndSetNvdPropsForOldYears(imagePointLatlng, imagePoint);
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
    children: React.ReactNode;
    headline?: string;
  }

  const ItemGroupContainer = ({ children, Icon, headline }: IItemGroupContainerProps) => {
    return (
      <Paper className={classes.itemGroupContainer}>
        <div className={classes.infoHeaderContainer}>
          <Icon className={classes.icon} />
          <Typography variant="subtitle2" className={classes.itemGroupHeader}>
            {headline}
          </Typography>
        </div>
        <div className={classes.informationLines}>{children}</div>
      </Paper>
    );
  };

  return (
    <Paper className={classes.infoContainer} style={{ maxHeight: maxHeight }}>
      <div className={classes.infoHeaderContainer}>
        <ImageInfoButton
          showInformation={showInformation}
          setShowInformation={setShowInformation}
          disabled={disabled ?? false}
        />
        <Typography variant="subtitle1" className={classes.infoHeader}>
          Dagsaktuell informasjon
        </Typography>
      </div>
      {imagePoint ? (
        <div className={classes.scrollContainer}>
          <ItemGroupContainer headline="Plassering" Icon={RoomOutlined}>
            <Typography variant="body1" className={classes.lines}>
              {vegsystemreferanse.length ? vegsystemreferanse : ''}
            </Typography>
            {gatenavn ? (
              <Typography variant="body1" className={classes.lines}>
                {gatenavn}
              </Typography>
            ) : null}
            {broNavn.length ? (
              <>
                {broNavn.map((broNavn) => (
                  <Typography variant="body1" className={classes.lines}>
                    {`${broNavn} (bru)`}
                  </Typography>
                ))}
              </>
            ) : null}
            {tunnelNavn.length ? (
              <Typography variant="body1" className={classes.lines}>
                {`${tunnelNavn[0]}`}
              </Typography>
            ) : null}
            {kommuneNavn ? (
              <Typography variant="body1" className={classes.lines}>
                {`${kommuneNavn}`}
              </Typography>
            ) : null}
            {fylkesNavn.length && imagePoint.properties.FYLKENUMMER ? (
              <Typography variant="body1" className={classes.lines}>
                {`${fylkesNavn} (${imagePoint.properties.FYLKENUMMER})`}
              </Typography>
            ) : null}
          </ItemGroupContainer>
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
          {imagePoint.properties.DETEKTERTEOBJEKTER ? (
            <ItemGroupContainer
              headline={`Sladdet objekter (${getNumberOfDetectedObjects(imagePoint)})`}
              Icon={SladdetIcon}
            >
              <div className={classes.detectedObjects}>
                {Object.keys(getDetectedObjectsJson(imagePoint)).map((item) => (
                  <div className={classes.detectedObjectFrame}>
                    {' '}
                    <Typography variant="body1" className={classes.lines}>
                      {item}
                    </Typography>{' '}
                  </div>
                ))}
              </div>
            </ItemGroupContainer>
          ) : null}
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
            <Paper className={classes.itemGroupContainer}>
              <div className={classes.NordkappLindesnesHeader}>
                <DistanceToIcon className={classes.icon} />
                <Typography variant="subtitle2" className={classes.NordkappLindesnesHeaderWord}>
                  Nordkapp
                </Typography>
                <Typography variant="subtitle2" className={classes.NordkappLindesnesHeaderWord}>
                  Lindesnes
                </Typography>
              </div>
              <div className={classes.NordkappLindesnesHeader}>
                <Typography
                  variant="body1"
                  className={classes.NordkappLindesnesWord}
                  style={{ marginLeft: '2rem' }}
                >
                  {' '}
                  {`${distanceToNordkapp}km`}
                </Typography>
                <Typography variant="body1" className={classes.NordkappLindesnesWord}>
                  {' '}
                  {`${distanceToLindesnes}km`}
                </Typography>
              </div>
            </Paper>
          ) : null}
        </div>
      ) : null}
    </Paper>
  );
};

export default ImageInfo;
