import React, { useEffect, useState } from 'react';
import { IconButton, makeStyles, Popover, Tooltip, Typography } from '@material-ui/core';

import { getImagePointLatLng, getRoadReference } from 'utilities/imagePointUtilities';
import { IImagePoint, ILatlng } from 'types';
import { InformIcon } from 'components/Icons/Icons';
import { GetKommuneAndFylkeByLatLng } from 'apis/geonorge/getKommuneAndFylkeByLatLng';
import { getDistanceFromLatLonInKm } from 'utilities/latlngUtilities';
import GetFartsgrenseByVegsystemreferanse from 'apis/NVDB/getFartsgrenseByVegsystemreferanse';

const useStyles = makeStyles((theme) => ({
  popover: {
    width: '17rem',
    padding: '1rem',
    marginBottom: '1rem',
    border: `1px solid ${theme.palette.common.grayDark}`,
  },
  lines: {
    padding: '0.3rem',
  },
  button: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
  },
}));

interface IMoreImageInfoProps {
  imagePoint: IImagePoint;
  className?: string;
  disabled?: boolean;
}

const MoreImageInfo = ({ imagePoint, className, disabled }: IMoreImageInfoProps) => {
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

  const getFartsgrense = async (imagePoint: IImagePoint) => {
    const vegsystemreferanse = getRoadReference(imagePoint)
      .withoutFelt.replace(/\s/g, '')
      .toLocaleLowerCase();
    await GetFartsgrenseByVegsystemreferanse(vegsystemreferanse).then((res) => {
      if (res && res.objekter.length) {
        const egenskaper = res.objekter[0].egenskaper ?? res.objekter.egenskaper;
        const fartsgrense = egenskaper.find((egenskap: any) => egenskap.navn === 'Fartsgrense');
        setFartsgrense(fartsgrense.verdi);
      }
    });
  };

  const handleMoreInfoButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreInfoAnchorEl(event.currentTarget);
  };

  const handleMoreInfoClose = () => {
    setMoreInfoAnchorEl(null);
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

  return (
    <>
      <Tooltip title="Mer info om bildet">
        <IconButton
          disabled={disabled}
          aria-label="Mer info om bildet"
          className={className}
          onClick={(event) => {
            if (imagePoint) handleMoreInfoButtonClick(event);
          }}
        >
          <InformIcon />
        </IconButton>
      </Tooltip>
      {imagePoint && moreInfoAnchorEl ? (
        <Popover
          id={Boolean(moreInfoAnchorEl) ? 'more-info' : undefined}
          open={Boolean(moreInfoAnchorEl)}
          anchorEl={moreInfoAnchorEl}
          onClose={handleMoreInfoClose}
          PaperProps={{ classes: { root: classes.popover } }}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          {/* <Typography variant="body1" className={classes.lines}>
            {`Strekningsnavn: ${strekningsnavn}`}
          </Typography> */}
          {fylkesNavn.length && imagePoint.properties.FYLKENUMMER ? (
            <Typography variant="body1" className={classes.lines}>
              {' '}
              {`${fylkesNavn} (${imagePoint.properties.FYLKENUMMER}), ${kommuneNavn}`}
            </Typography>
          ) : null}
          {fartsgrense > 0 ? (
            <Typography
              variant="body1"
              className={classes.lines}
            >{`Fartsgrense: ${fartsgrense}km/h`}</Typography>
          ) : null}
          {position ? (
            <>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Breddegrad: ${position?.lat}`}
              </Typography>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Lengdegrad: ${position?.lng}`}
              </Typography>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Distanse til Nordkapp: ${distanceToNordkapp} km`}
              </Typography>
              <Typography variant="body1" className={classes.lines}>
                {' '}
                {`Distanse til Lindesnes: ${distanceToLindesnes} km`}
              </Typography>
            </>
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
        </Popover>
      ) : null}
    </>
  );
};

export default MoreImageInfo;
