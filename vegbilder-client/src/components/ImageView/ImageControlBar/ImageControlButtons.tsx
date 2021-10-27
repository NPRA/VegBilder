import React, { MouseEvent, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import { Replay }  from '@material-ui/icons';
import ReportIcon from '@material-ui/icons/Report';
import ShareIcon from '@material-ui/icons/Share';
import ExploreOutlinedIcon from '@material-ui/icons/ExploreOutlined';
import Tooltip from '@material-ui/core/Tooltip';
import { useRecoilState, useRecoilValue } from 'recoil';
import proj4 from 'proj4';
import clsx from 'clsx';
// En Panellum-instans er global og det er dermed mulig å kalle eks. getHfov globalt.
// @ts-ignore
import { getHfov, setHfov, getYaw, setYaw, getPitch, setPitch, toggleFullscreen } from 'react-pannellum'; //Ingorert for testing TODO: Opprett d.ts fil for Panellum

import { useCommand, commandTypes } from 'contexts/CommandContext';
import {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  HistoryIcon,
  MeasureIcon,
  MeasureDisabledIcon,
  PlayIcon,
  StopIcon,
  TimerIcon,
  CheckmarkIcon,
  PauseIcon,
  ZoomOutIcon,
  ZoomInIcon,
  EnlargeIcon
} from '../../Icons/Icons';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { getShareableUrlForImage } from 'utilities/urlUtilities';
import { getImageType } from 'utilities/imagePointUtilities';
import { playVideoState, currentLatLngZoomState, currentPannellumHfovState } from 'recoil/atoms';
import Theme from 'theme/Theme';
import { Link, ListSubheader } from '@material-ui/core';
import { TIMER_OPTIONS, TIMER_OPTIONS_360 } from 'constants/defaultParamters';
import { imagePointQueryParameterState } from 'recoil/selectors';
import { VEGKART } from 'constants/urls';
import { pannellumSettings } from 'constants/settings';

interface StyleProps {
  is360Image: boolean;
}

const useStyles = makeStyles<typeof Theme, StyleProps>((theme) => ({
  button: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
    '@media (max-width:780px) and (orientation: portrait)': {
      margin: props => props.is360Image ? '0.75rem' : '1rem',
    }
  },
  buttonDisabled: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
    opacity: '30%',
    '@media (max-width:780px) and (orientation: portrait)': {
      margin: '0.75rem'
    }
  },
  activeButton: {
    backgroundColor: 'transparent',
    margin: '1.25rem',
    '& .MuiIconButton-label': {
      '& svg': {
        '& path': {
          fill: theme.palette.common.orangeDark,
        },
      },
    },
  },
  arrowTurnButton: {
    '& .MuiIconButton-label': {
      '& .MuiSvgIcon-root': {
        width: '30px',
      },
    },
  },
  speedMenuItem: {
    padding: '0.25rem 2.125rem',
  },
  iconStyle: {
    position: 'absolute',
    left: '0.75rem',
  },
}));

interface IImageControlButtonsProps {
  showMessage: (message: string) => void;
  setShowReportErrorsScheme: (value: boolean) => void;
  timeBetweenImages: number;
  setTimeBetweenImages: (newTime: number) => void;
  meterLineVisible: boolean;
  setMeterLineVisible: (visible: boolean) => void;
  isZoomedInImage: boolean;
  setIsZoomedInImage: (isZoomedIn: boolean) => void;
  isHistoryMode: boolean;
  setIsHistoryMode: (isHistoryMode: boolean) => void;
}

const ImageControlButtons = ({
  showMessage,
  setShowReportErrorsScheme,
  timeBetweenImages,
  setTimeBetweenImages,
  meterLineVisible,
  setMeterLineVisible,
  isZoomedInImage,
  setIsZoomedInImage,
  isHistoryMode,
  setIsHistoryMode,
}: IImageControlButtonsProps) => {
  const { setCommand } = useCommand();
  const currentImagePoint = useRecoilValue(imagePointQueryParameterState);

  const { copyToClipboard } = useCopyToClipboard();

  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = useState<Element | null>(null);
  const [timerOptionsAnchorEl, setTimerOptionsAnchorEl] = useState<Element | null>(null);
  const [playVideo, setPlayVideo] = useRecoilState(playVideoState);
  const [playMode, setPlayMode] = useState(false);
  const currentCoordinates = useRecoilValue(currentLatLngZoomState);
  const [CURRENT_TIMER_OPTIONS, setTimerOptions] = useState(TIMER_OPTIONS);

  const handleMoreControlsClose = () => setMoreControlsAnchorEl(null);
  const handleTimerOptionsClose = () => setTimerOptionsAnchorEl(null);
  const handleTimerOptionSelect = (time: number) => setTimeBetweenImages(time);
  const handleTimerOptionsClick = (event: MouseEvent) =>
    setTimerOptionsAnchorEl(event.currentTarget);
  const handleMoreControlsClick = (event: MouseEvent) =>
    setMoreControlsAnchorEl(event.currentTarget);

  const [pannellumHfovState, setCurrentPannellumHfovState] = useRecoilState(currentPannellumHfovState);
  const is360Image = currentImagePoint && getImageType(currentImagePoint) === '360' ? true : false;

  const classes = useStyles({is360Image});

  let [isMinOrMaxZoom, setMinAndMaxZoom] = useState({"isMinZoom": false, "isMaxZoom": false}); 

  type zoomType = 'zoomIn' | 'zoomOut';

  const zoom360 = (zoomType: zoomType) => {
    if (zoomType === 'zoomIn' && !isMinOrMaxZoom.isMaxZoom) {
      let newZoomIn = Math.max(getHfov() - 10, pannellumSettings.minHfovBounds);
      setHfov(newZoomIn);
      setCurrentPannellumHfovState(newZoomIn);
    } else if (zoomType === 'zoomOut' && !isMinOrMaxZoom.isMinZoom) {
      let newZoomOut = Math.min(getHfov() + 10, pannellumSettings.maxHfovBounds);
      setCurrentPannellumHfovState(newZoomOut);
      setHfov(newZoomOut);
    }
  }

  const updateZoomMinAndMax = () => {
    if (pannellumHfovState <= pannellumSettings.minHfovBounds) {
      setMinAndMaxZoom({"isMinZoom": false, "isMaxZoom": true})
    } else if (pannellumHfovState >= pannellumSettings.maxHfovBounds) {
      setMinAndMaxZoom({"isMinZoom": true, "isMaxZoom": false})
    } else {
      setMinAndMaxZoom({"isMinZoom": false, "isMaxZoom": false});
    }
  }

  useEffect(() => {
    updateZoomMinAndMax();
  }, [pannellumHfovState]);

  useEffect(() => {
    if (is360Image) {
      setTimerOptions(TIMER_OPTIONS_360);
    } else {
      setTimerOptions(TIMER_OPTIONS);
    }
  }, [currentImagePoint])

  const copyShareableUrlToClipboard = () => {
    if (currentImagePoint) {
      showMessage('Lenke kopiert til utklippstavle');
      const shareableUrl = getShareableUrlForImage();
      copyToClipboard(shareableUrl);
    }
  };

  const reset360View = () => {
    if (getYaw() !== 0 || getPitch() !== 0 || getHfov() !== 100) {
      setYaw(0);
      setPitch(0);
      setHfov(100);
    };
  };

  const handleHistoryButtonClick = () => {
    setIsHistoryMode(!isHistoryMode);
  };

  const getLinkToVegkart = () => {
    if (
      currentImagePoint &&
      Number.isFinite(currentCoordinates.lat) &&
      Number.isFinite(currentCoordinates.lng)
    ) {
      const utm33Projection = '+proj=utm +zone=33 +ellps=GRS80 +units=m +no_defs';
      const utm33coordinates = proj4(utm33Projection, [
        currentCoordinates.lng,
        currentCoordinates.lat,
      ]);
      return `${VEGKART}@${Math.round(Math.round(utm33coordinates[0]))},${Math.round(
        utm33coordinates[1]
      )},14/vegsystemreferanse:${utm33coordinates[0]}:${utm33coordinates[1]}`;
    } else return VEGKART;
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowDown':
          setCommand(commandTypes.goBackwards);
          break;
        case 'ArrowUp':
          setCommand(commandTypes.goForwards);
          break;
        default:
        // Ignore other key presses
      }
    };
    document.body.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.removeEventListener('keydown', onKeyDown);
    };
  }, [setCommand]);

  const changeSpeedButtonMenu = () => {
    return (
      <>
        <Tooltip title="Bytt hastighet på avspilling">
          <IconButton
            aria-label="Bytt hastighet på avspilling"
            onClick={handleTimerOptionsClick}
            className={timerOptionsAnchorEl ? classes.activeButton : classes.button}
          >
            <TimerIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="timer-options"
          anchorEl={timerOptionsAnchorEl}
          keepMounted
          open={Boolean(timerOptionsAnchorEl)}
          onClose={handleTimerOptionsClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <ListSubheader> Hastighet </ListSubheader>
          {CURRENT_TIMER_OPTIONS.map((option, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                handleTimerOptionSelect(option);
                handleTimerOptionsClose();
              }}
              className={classes.speedMenuItem}
            >
              {option === timeBetweenImages && <CheckmarkIcon className={classes.iconStyle} />}
              <ListItemText
                key={`Text${i}`}
                primary={(option / 1000).toString() + ' sekunder'}
                style={{
                  color: option === timeBetweenImages ? Theme.palette.common.orangeDark : '',
                }}
              />
            </MenuItem>
          ))}
        </Menu>
      </>
    );
  };

  const zoomInOutButton = () => {
    return (
      <Tooltip title={isZoomedInImage ? 'Vis skalert bilde' : 'Vis bilde i 1:1 størrelse'}>
        <IconButton
          disabled={isHistoryMode}
          aria-label="Zoom inn/ut"
          className={isHistoryMode ? classes.buttonDisabled : classes.button}
          onClick={() => {
          setIsZoomedInImage(!isZoomedInImage);
            if (isZoomedInImage) setMeterLineVisible(false);
          }}
        >
          {isZoomedInImage ? <ZoomOutIcon /> : <ZoomInIcon />}
        </IconButton>
      </Tooltip>
    );
  };

  const zoomInOut360Button = (zoomType: zoomType) => {
    return (
      <Tooltip title={zoomType === 'zoomIn' ? 'Zoom inn' : 'Zoom ut'}>
        <IconButton
          disabled={isHistoryMode || (zoomType === 'zoomIn' && isMinOrMaxZoom.isMaxZoom) || (zoomType === 'zoomOut' && isMinOrMaxZoom.isMinZoom)}
          aria-label={zoomType}
          className={isHistoryMode || (zoomType === 'zoomIn' && isMinOrMaxZoom.isMaxZoom) || (zoomType === 'zoomOut' && isMinOrMaxZoom.isMinZoom) ? classes.buttonDisabled : classes.button}
          onClick={() => {
            zoom360(zoomType);
          }}
        >
          {zoomType === "zoomIn" ? <ZoomInIcon/> : <ZoomOutIcon/>}
        </IconButton>
      </Tooltip>
    );
  };

  const changeDirectionButton = () => {
    return (
      <Tooltip title="Bytt kjøreretning">
        <IconButton
          aria-label="Bytt kjøreretning"
          className={clsx(classes.button, classes.arrowTurnButton)}
          onClick={() => setCommand(commandTypes.turnAround)}
        >
          <ArrowTurnIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const historyButton = () => {
    return (
      <Tooltip title="Bilder fra andre datoer">
        <IconButton
          aria-label="Bilder fra andre datoer"
          className={isHistoryMode ? classes.activeButton : classes.button}
          onClick={handleHistoryButtonClick}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const showFullSceenButton = () => {
    return (
      <Tooltip title={'Fullskjermvisning'}>
        <IconButton
          disabled={isHistoryMode}
          aria-label="Aktiver fullskjermvisning"
          className={isHistoryMode ? classes.buttonDisabled : classes.button}
          onClick={() => toggleFullscreen()}
        >
          {<EnlargeIcon />}
        </IconButton >
      </Tooltip>
    );
  };


  const hideShowBasisLineButton = () => {
    return (
      <Tooltip title={meterLineVisible ? 'Deaktiver basislinje' : 'Aktiver basislinje'}>
        <IconButton
          disabled={isZoomedInImage || is360Image}
          aria-label="Deaktiver/Aktiver basislinje"
          className={isZoomedInImage || is360Image ? classes.buttonDisabled : classes.button}
          onClick={() => setMeterLineVisible(!meterLineVisible)}
        >
          {meterLineVisible ? <MeasureIcon /> : <MeasureDisabledIcon />}
        </IconButton>
      </Tooltip>
    );
  };

  const reset360ViewButton = () => {
    return (
      <Tooltip title={'Tilbakestill visning'}>
        <IconButton
          disabled={isHistoryMode}
          aria-label="Tilbakestill visning"
          className={isHistoryMode ? classes.buttonDisabled : classes.button}
          onClick={() => reset360View()}
        >
          {<Replay />}
        </IconButton >
      </Tooltip>
    );
  };

  const moreFunctionsButton = () => {
    return (
      <Tooltip title="Flere funksjoner">
        <IconButton
          disabled={playVideo}
          aria-label="Flere funksjoner"
          onClick={handleMoreControlsClick}
          className={moreControlsAnchorEl ? classes.activeButton : classes.button}
        >
          <DotsHorizontalIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const playIconButton = (tooltip: string) => {
    return (
      <Tooltip title={tooltip}>
        <IconButton
          aria-label="Start animasjonsmodus"
          className={
            isHistoryMode
              ? classes.buttonDisabled
              : playVideo
              ? classes.activeButton
              : classes.button
          }
          disabled={isHistoryMode}
          onClick={() => {
            setPlayVideo(true);
            setPlayMode(true);
            setMeterLineVisible(false);
          }}
        >
          <PlayIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const stopAnimationButton = () => {
    return (
      <Tooltip title="Gå ut av animasjonsmodus">
        <IconButton
          aria-label="Gå ut av animasjonsmodus"
          className={classes.button}
          onClick={() => {
            setPlayVideo(false);
            setPlayMode(false);
          }}
        >
          <StopIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const renderPlayVideoMenu = () => {
    return (
      <>
        {stopAnimationButton()}
        {/* pause button  */}
        <Tooltip title={playVideo ? 'Pause avspilling' : 'Spill av animasjon'}>
          <IconButton
            aria-label={playVideo ? 'Pause avspilling' : 'Spill av'}
            className={classes.button}
            onClick={() => {
              setPlayVideo(!playVideo);
            }}
          >
            {playVideo ? <PauseIcon /> : <PlayIcon />}
          </IconButton>
        </Tooltip>

        {changeSpeedButtonMenu()}
      </>
    );
  };

  return (
    <>
      <Toolbar>
        {playMode ? renderPlayVideoMenu() : null}
        {!playMode && !playVideo ? (
          <>
            {/*  Render normal menu */}
            {!is360Image && zoomInOutButton()}
            {is360Image && showFullSceenButton()}
            {is360Image && zoomInOut360Button("zoomIn")}
            {is360Image && zoomInOut360Button("zoomOut")}
            {/* move backwards arrow button  */}
            <Tooltip title="Gå bakover">
              <IconButton
                aria-label="Gå bakover"
                className={classes.button}
                onClick={() => setCommand(commandTypes.goBackwards)}
              >
                <ArrowDownIcon />
              </IconButton>
            </Tooltip>

            {/* move forwards arrow button  */}
            <Tooltip title="Gå fremover">
              <IconButton
                aria-label="Gå fremover"
                className={classes.button}
                onClick={() => setCommand(commandTypes.goForwards)}
              >
                <ArrowUpIcon />
              </IconButton>
            </Tooltip>

            {changeDirectionButton()}
            {playIconButton('Start animasjonsmodus')}
            {!is360Image ? hideShowBasisLineButton() : null}
            {reset360ViewButton()}
            {historyButton()}
            {moreFunctionsButton()}
          </>
        ) : null}
      </Toolbar>

      {/* more functions menu  */}
      {currentImagePoint ? (
        <Menu
          id="more-controls-menu"
          anchorEl={moreControlsAnchorEl}
          keepMounted
          open={Boolean(moreControlsAnchorEl)}
          onClose={handleMoreControlsClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
        >
          <MenuItem
            onClick={() => {
              handleMoreControlsClose();
              setShowReportErrorsScheme(true);
            }}
          >
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Meld feil" />{' '}
          </MenuItem>

          <MenuItem
            onClick={() => {
              copyShareableUrlToClipboard();
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <ShareIcon />
            </ListItemIcon>
            <ListItemText primary="Del" />
          </MenuItem>

          <Link target="_blank" rel="noopener noreferer" href={getLinkToVegkart()}>
            <MenuItem>
              <ListItemIcon>
                <ExploreOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Gå til Vegkart" />
            </MenuItem>
          </Link>
        </Menu>
      ) : null}
    </>
  );
};

export default ImageControlButtons;
