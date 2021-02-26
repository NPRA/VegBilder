import React, { MouseEvent, useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReportIcon from '@material-ui/icons/Report';
import ShareIcon from '@material-ui/icons/Share';
import Tooltip from '@material-ui/core/Tooltip';
import { useRecoilState, useRecoilValue } from 'recoil';

import clsx from 'clsx';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  HistoryIcon,
  MapIcon,
  MapDisabledIcon,
  MeasureIcon,
  MeasureDisabledIcon,
  PlayIcon,
  StopIcon,
  TimerIcon,
  CheckmarkIcon,
  PauseIcon,
} from '../../Icons/Icons';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { getShareableUrlForImage } from 'utilities/urlUtilities';
import { isHistoryModeState, playVideoState, currentHistoryImageState } from 'recoil/atoms';
import Theme from 'theme/Theme';
import MoreImageInfo from 'components/MoreImageInfo/MoreImageInfo';
import { ListSubheader } from '@material-ui/core';
import { TIMER_OPTIONS } from 'constants/defaultParamters';

const useStyles = makeStyles(() => ({
  button: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
    opacity: '30%',
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
  miniMapVisible: boolean;
  setMiniMapVisible: (visible: boolean) => void;
  meterLineVisible: boolean;
  setMeterLineVisible: (visible: boolean) => void;
  isEnlargedImage: boolean;
}

const ImageControlButtons = ({
  showMessage,
  setShowReportErrorsScheme,
  timeBetweenImages,
  setTimeBetweenImages,
  miniMapVisible,
  meterLineVisible,
  setMiniMapVisible,
  setMeterLineVisible,
  isEnlargedImage,
}: IImageControlButtonsProps) => {
  const classes = useStyles();
  const { setCommand } = useCommand();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { copyToClipboard } = useCopyToClipboard();

  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = useState<Element | null>(null);
  const [timerOptionsAnchorEl, setTimerOptionsAnchorEl] = useState<Element | null>(null);
  const [playVideo, setPlayVideo] = useRecoilState(playVideoState);
  const [isHistoryMode, setHistoryMode] = useRecoilState(isHistoryModeState);
  const [playMode, setPlayMode] = useState(false);
  const currentHistoryImage = useRecoilValue(currentHistoryImageState);

  const handleMoreControlsClose = () => setMoreControlsAnchorEl(null);
  const handleTimerOptionsClose = () => setTimerOptionsAnchorEl(null);
  const handleTimerOptionSelect = (time: number) => setTimeBetweenImages(time);
  const handleTimerOptionsClick = (event: MouseEvent) =>
    setTimerOptionsAnchorEl(event.currentTarget);
  const handleMoreControlsClick = (event: MouseEvent) =>
    setMoreControlsAnchorEl(event.currentTarget);

  const copyShareableUrlToClipboard = () => {
    if (currentImagePoint) {
      showMessage('Lenke kopiert til utklippstavle');
      const shareableUrl = getShareableUrlForImage();
      copyToClipboard(shareableUrl);
    }
  };

  const handleHistoryButtonClick = () => {
    if (isHistoryMode) {
      if (currentHistoryImage) {
        setCurrentImagePoint(currentHistoryImage);
      }
      setHistoryMode(false);
    } else {
      setHistoryMode(true);
    }
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
            className={classes.button}
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
          {TIMER_OPTIONS.map((option, i) => (
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

  const hideShowMiniMapButton = () => {
    return (
      <Tooltip title={miniMapVisible ? 'Skjul kart' : 'Vis kart'}>
        <IconButton
          disabled={isEnlargedImage}
          aria-label="Vis/skjul kart"
          className={isEnlargedImage ? classes.buttonDisabled : classes.button}
          onClick={() => setMiniMapVisible(!miniMapVisible)}
        >
          {miniMapVisible ? <MapIcon /> : <MapDisabledIcon />}
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
          className={classes.button}
          onClick={handleHistoryButtonClick}
        >
          <HistoryIcon />
        </IconButton>
      </Tooltip>
    );
  };

  const hideShowBasisLineButton = () => {
    return (
      <Tooltip title={meterLineVisible ? 'Deaktiver basislinje' : 'Aktiver basislinje'}>
        <IconButton
          aria-label="Deaktiver/Aktiver basislinje"
          className={classes.button}
          onClick={() => setMeterLineVisible(!meterLineVisible)}
        >
          {meterLineVisible ? <MeasureIcon /> : <MeasureDisabledIcon />}
        </IconButton>
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
          className={classes.button}
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
          className={isHistoryMode ? classes.buttonDisabled : classes.button}
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
        <Tooltip title="Pause avspilling">
          <IconButton
            aria-label="Pause avspilling"
            className={classes.button}
            onClick={() => {
              setPlayVideo(false);
            }}
          >
            <PauseIcon />
          </IconButton>
        </Tooltip>

        {changeSpeedButtonMenu()}
      </>
    );
  };

  const renderPlayModeMenu = () => {
    return (
      <>
        {hideShowMiniMapButton()}
        {changeDirectionButton()}
        {hideShowBasisLineButton()}
        {historyButton()}
        {playIconButton('Spill av bildeserie')}
        {stopAnimationButton()}
        {changeSpeedButtonMenu()}
        <MoreImageInfo imagePoint={currentImagePoint} className={classes.button} />
        {moreFunctionsButton()}
      </>
    );
  };

  return (
    <>
      <Toolbar>
        {playVideo ? renderPlayVideoMenu() : null}
        {playMode && !playVideo ? renderPlayModeMenu() : null}
        {!playMode && !playVideo ? (
          <>
            {hideShowMiniMapButton()}

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
            {hideShowBasisLineButton()}
            {historyButton()}
            <MoreImageInfo imagePoint={currentImagePoint} className={classes.button} />
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
        </Menu>
      ) : null}
    </>
  );
};

export default ImageControlButtons;
