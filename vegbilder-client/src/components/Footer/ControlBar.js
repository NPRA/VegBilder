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
import { useRecoilState } from 'recoil';

import clsx from 'clsx';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useToggles } from 'contexts/TogglesContext';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  //HistoryIcon,
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
} from '../Icons/Icons';
import useCopyToClipboard from 'hooks/useCopyToClipboard';
import { getShareableUrlForImage } from 'utilities/urlUtilities';
import { createMailtoHrefForReporting } from 'utilities/mailtoUtilities';
import { getImageUrl } from 'utilities/imagePointUtilities';
import { playVideoState, timerState } from 'recoil/atoms';

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
  const { currentImagePoint } = useCurrentImagePoint();
  const { copyToClipboard } = useCopyToClipboard();

  const [moreControlsAnchorEl, setMoreControlsAnchorEl] = useState(null);
  const [timerOptionsAnchorEl, setTimerOptionsAnchorEl] = useState(null);
  const [playVideo, setPlayVideo] = useRecoilState(playVideoState);
  const [currentTime, setTime] = useRecoilState(timerState);

  const timerOptions = [1000, 2000, 3000];

  const [playMode, setPlayMode] = useState(false);

  const handleMoreControlsClose = () => setMoreControlsAnchorEl(null);

  const handleTimerOptionsClose = () => setTimerOptionsAnchorEl(null);

  const handleTimerOptionSelect = (time) => setTime(time);

  const handleTimerOptionsClick = (event) => setTimerOptionsAnchorEl(event.currentTarget);

  const handleMoreControlsClick = (event) => setMoreControlsAnchorEl(event.currentTarget);

  const copyShareableUrlToClipboard = () => {
    const shareableUrl = getShareableUrlForImage(currentImagePoint);
    copyToClipboard(shareableUrl);
    showMessage('Lenke kopiert til utklippstavle');
  };

  const openPrefilledEmailInDefaultEmailClient = () => {
    window.open(createMailtoHrefForReporting(currentImagePoint), '_self');
    showMessage('Åpner e-post-klient');
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
          <IconButton
            aria-label="Skjul kart"
            className={classes.button}
            onClick={() => setMiniMapVisible(false)}
          >
            <MapIcon />
          </IconButton>
        ) : (
          <IconButton
            disabled={playVideo}
            aria-label="Vis kart"
            className={classes.button}
            onClick={() => setMiniMapVisible(true)}
          >
            <MapDisabledIcon />
          </IconButton>
        )}

        {!playMode && (
          <>
            <IconButton
              aria-label="Gå bakover"
              className={classes.button}
              onClick={() => setCommand(commandTypes.goBackwards)}
            >
              <ArrowDownIcon />
            </IconButton>
            <IconButton
              aria-label="Gå fremover"
              className={classes.button}
              onClick={() => setCommand(commandTypes.goForwards)}
            >
              <ArrowUpIcon />
            </IconButton>
          </>
        )}

        {playVideo ? (
          <ArrowTurnDisabledIcon className={clsx(classes.button, classes.arrowTurnButton)} />
        ) : (
          <IconButton
            aria-label="Bytt kjøreretning"
            className={clsx(classes.button, classes.arrowTurnButton)}
            onClick={() => setCommand(commandTypes.turnAround)}
          >
            <ArrowTurnIcon />
          </IconButton>
        )}

        {playMode && (
          <IconButton
            aria-label="Stopp animasjonsmodus"
            title="Gå ut av animasjonsmodus"
            className={classes.button}
            onClick={() => {
              setPlayVideo(false);
              setPlayMode(false);
            }}
          >
            <StopIcon />
          </IconButton>
        )}

        {playVideo ? (
          <IconButton
            aria-label="Stopp autoplay"
            title="Pause animasjonen"
            className={classes.button}
            onClick={() => {
              setPlayVideo(false);
            }}
          >
            <PauseIcon />
          </IconButton>
        ) : (
          <IconButton
            aria-label="Start animasjonsmodus"
            className={classes.button}
            onClick={() => {
              setPlayVideo(true);
              setPlayMode(true);
            }}
          >
            <PlayIcon />
          </IconButton>
        )}

        {playMode && (
          <>
            <IconButton
              aria-label="Bytt tid"
              onClick={handleTimerOptionsClick}
              className={classes.button}
            >
              <TimerIcon />
            </IconButton>
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
              {timerOptions.map((option) => (
                <MenuItem
                  onClick={() => {
                    handleTimerOptionSelect(option);
                    handleTimerOptionsClose();
                  }}
                  className={classes.speedMenuItem}
                >
                  {option === currentTime && <CheckmarkIcon className={classes.iconStyle} />}
                  <ListItemText
                    primary={(option / 1000).toString() + ' sekunder'}
                    style={{ color: option === currentTime ? '#F67F00' : '' }}
                  />
                </MenuItem>
              ))}
            </Menu>
          </>
        )}

        {meterLineVisible && !playVideo ? (
          <IconButton
            aria-label="Mål avstand"
            className={classes.button}
            onClick={() => setMeterLineVisible(false)}
          >
            <MeasureIcon />
          </IconButton>
        ) : (
          <IconButton
            disabled={playVideo}
            aria-label="Mål avstand"
            className={classes.button}
            onClick={() => setMeterLineVisible(true)}
          >
            <MeasureDisabledIcon />
          </IconButton>
        )}

        {/*
        <IconButton
          aria-label="Finn bilder herfra på andre datoer"
          className={classes.button}
        >
          <HistoryIcon />
        </IconButton>
        */}
        {playVideo ? (
          <DotsHorizontalDisabledIcon className={classes.button} />
        ) : (
          <IconButton
            aria-label="Flere funksjoner"
            onClick={handleMoreControlsClick}
            className={classes.button}
          >
            <DotsHorizontalIcon />
          </IconButton>
        )}
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
              window.open(getImageUrl(currentImagePoint), '_blank', 'noopener');
              handleMoreControlsClose();
            }}
          >
            <ListItemIcon>
              <OpenInNewIcon />
            </ListItemIcon>
            <ListItemText primary="Åpne bilde i ny fane" />
          </MenuItem>
        </Menu>
      ) : null}
    </>
  );
};

export default ControlBar;
