import React, { useEffect, useState } from 'react';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ReportIcon from '@material-ui/icons/Report';
import ShareIcon from '@material-ui/icons/Share';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import Tooltip from '@material-ui/core/Tooltip';
import { useRecoilState, useRecoilValue } from 'recoil';

import clsx from 'clsx';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useToggles } from 'contexts/TogglesContext';
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
  ArrowTurnDisabledIcon,
  DotsHorizontalDisabledIcon,
  PlayDisabledIcon,
} from '../Icons/Icons';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { getShareableUrlForImage } from 'utilities/urlUtilities';
import { createMailtoHrefForReporting } from 'utilities/mailtoUtilities';
import { getImageUrl } from 'utilities/imagePointUtilities';
import {
  isHistoryModeState,
  playVideoState,
  timerState,
  currentHistoryImageState,
} from 'recoil/atoms';
import Theme from 'theme/Theme';
import MoreImageInfo from 'components/MoreImageInfo/MoreImageInfo';

const useStyles = makeStyles((theme) => ({
  button: {
    margin: '1.25rem',
    backgroundColor: 'transparent',
  },
  arrowTurnButton: {
    '& .MuiIconButton-label': {
      '& .MuiSvgIcon-root': {
        width: '30px',
      },
    },
  },
  speedHeading: {
    color: theme.palette.common.grayMenuItems,
    textTransform: 'uppercase',
    paddingTop: '1.21875rem',
    paddingLeft: '1.875rem',
    paddingRight: '1.875rem',
    paddingBottom: '0.75rem',
    margin: 0,
    fontWeight: 600,
  },
  speedMenuItem: {
    padding: '0.25rem 2.125rem',
  },
  iconStyle: {
    position: 'absolute',
    left: '0.75rem',
  },
}));

const ControlBar = ({ showMessage }) => {
  const classes = useStyles();
  const { setCommand } = useCommand();
  const { miniMapVisible, meterLineVisible, setMiniMapVisible, setMeterLineVisible } = useToggles();
  const { currentImagePoint, setCurrentImagePoint } = useCurrentImagePoint();
  const { copyToClipboard } = useCopyToClipboard();

  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = useState(null);
  const [timerOptionsAnchorEl, setTimerOptionsAnchorEl] = useState(null);
  const [playVideo, setPlayVideo] = useRecoilState(playVideoState);
  const [currentTime, setTime] = useRecoilState(timerState);
  const [isHistoryMode, setHistoryMode] = useRecoilState(isHistoryModeState);
  const [playMode, setPlayMode] = useState(false);
  const currentHistoryImage = useRecoilValue(currentHistoryImageState);

  const timerOptions = [1000, 2000, 3000, 4000, 5000];

  const handleMoreControlsClose = () => setMoreControlsAnchorEl(null);
  const handleTimerOptionsClose = () => setTimerOptionsAnchorEl(null);
  const handleTimerOptionSelect = (time) => setTime(time);
  const handleTimerOptionsClick = (event) => setTimerOptionsAnchorEl(event.currentTarget);
  const handleMoreControlsClick = (event) => setMoreControlsAnchorEl(event.currentTarget);

  const copyShareableUrlToClipboard = () => {
    if (currentImagePoint) {
      showMessage('Lenke kopiert til utklippstavle');
      const shareableUrl = getShareableUrlForImage(currentImagePoint);
      copyToClipboard(shareableUrl);
    }
  };

  const openPrefilledEmailInDefaultEmailClient = () => {
    if (currentImagePoint) {
      window.open(createMailtoHrefForReporting(currentImagePoint), '_self');
      showMessage('Åpner e-post-klient');
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
    const onKeyDown = (event) => {
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
    return function cleanUp() {
      document.body.removeEventListener('keydown', onKeyDown);
    };
  }, [setCommand]);

  return (
    <>
      <Toolbar>
        {miniMapVisible && !playVideo ? (
          <Tooltip title="Skjul kart">
            <IconButton
              aria-label="Skjul kart"
              className={classes.button}
              onClick={() => setMiniMapVisible(false)}
            >
              <MapIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Vis kart">
            <IconButton
              disabled={playVideo}
              aria-label="Vis kart"
              className={classes.button}
              onClick={() => setMiniMapVisible(true)}
            >
              <MapDisabledIcon />
            </IconButton>
          </Tooltip>
        )}

        {!playMode && (
          <>
            <Tooltip title="Gå bakover">
              <IconButton
                aria-label="Gå bakover"
                className={classes.button}
                onClick={() => setCommand(commandTypes.goBackwards)}
              >
                <ArrowDownIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Gå fremover">
              <IconButton
                aria-label="Gå fremover"
                className={classes.button}
                onClick={() => setCommand(commandTypes.goForwards)}
              >
                <ArrowUpIcon />
              </IconButton>
            </Tooltip>
          </>
        )}

        {playVideo ? (
          <ArrowTurnDisabledIcon className={clsx(classes.button, classes.arrowTurnButton)} />
        ) : (
          <Tooltip title="Bytt kjøreretning">
            <IconButton
              aria-label="Bytt kjøreretning"
              className={clsx(classes.button, classes.arrowTurnButton)}
              onClick={() => setCommand(commandTypes.turnAround)}
            >
              <ArrowTurnIcon />
            </IconButton>
          </Tooltip>
        )}

        {playMode ? (
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
        ) : null}

        {playVideo ? (
          <Tooltip title="Pause animasjonen">
            <IconButton
              aria-label="Pause animasjonen"
              className={classes.button}
              onClick={() => {
                setPlayVideo(false);
              }}
            >
              <PauseIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title={playMode ? 'Start animasjonen' : 'Start animasjonsmodus'}>
            <IconButton
              aria-label="Start animasjonsmodus"
              className={classes.button}
              disabled={isHistoryMode}
              onClick={() => {
                setPlayVideo(true);
                setPlayMode(true);
              }}
            >
              {isHistoryMode ? <PlayDisabledIcon /> : <PlayIcon />}
            </IconButton>
          </Tooltip>
        )}

        {playMode && (
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
              <p className={classes.speedHeading}> Hastighet </p>
              {timerOptions.map((option, i) => (
                <MenuItem
                  key={i}
                  onClick={() => {
                    handleTimerOptionSelect(option);
                    handleTimerOptionsClose();
                  }}
                  className={classes.speedMenuItem}
                >
                  {option === currentTime && <CheckmarkIcon className={classes.iconStyle} />}
                  <ListItemText
                    key={`Text${i}`}
                    primary={(option / 1000).toString() + ' sekunder'}
                    style={{ color: option === currentTime ? Theme.palette.common.orangeDark : '' }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {meterLineVisible && !playVideo ? (
          <Tooltip title="Deaktiver basislinje">
            <IconButton
              aria-label="Deaktiver basislinje"
              className={classes.button}
              onClick={() => setMeterLineVisible(false)}
            >
              <MeasureIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Aktiver basislinje">
            <IconButton
              disabled={playVideo}
              aria-label="Deaktiver basislinje"
              className={classes.button}
              onClick={() => setMeterLineVisible(true)}
            >
              <MeasureDisabledIcon />
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title="Finn bilder herfra på andre datoer">
          <IconButton
            aria-label="Finn bilder herfra på andre datoer"
            className={classes.button}
            disabled={playVideo}
            onClick={handleHistoryButtonClick}
          >
            <HistoryIcon />
          </IconButton>
        </Tooltip>

        <MoreImageInfo
          imagePoint={currentImagePoint}
          className={classes.button}
          disabled={playVideo}
        />

        <Tooltip title="Flere funksjoner">
          <IconButton
            disabled={playVideo}
            aria-label="Flere funksjoner"
            onClick={handleMoreControlsClick}
            className={classes.button}
          >
            {playVideo ? <DotsHorizontalDisabledIcon /> : <DotsHorizontalIcon />}
          </IconButton>
        </Tooltip>
      </Toolbar>

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
              openPrefilledEmailInDefaultEmailClient();
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <ReportIcon />
            </ListItemIcon>
            <ListItemText primary="Meld feil" />
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
          <MenuItem
            onClick={() => {
              window.open(getImageUrl(currentImagePoint), '_blank', 'noopener noreferer');
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <ListItemText primary="Åpne bilde i nytt vindu" />
          </MenuItem>
        </Menu>
      ) : null}
    </>
  );
};

export default ControlBar;
