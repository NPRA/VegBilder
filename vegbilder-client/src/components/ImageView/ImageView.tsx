import React, { useEffect, useReducer, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { useRecoilValue } from 'recoil';

import ImageControlBar from 'components/ImageView/ImageControlBar/ImageControlBar';
import SmallMapContainer from 'components/MapContainer/SmallMapContainer';
import ImageViewer from 'components/ImageView/ImageViewer/ImageViewer';
import { TogglesProvider } from 'contexts/TogglesContext';
import { isHistoryModeState } from 'recoil/atoms';
import History from './History/History';
import ReportErrorFeedback from 'components/ImageView/ReportErrorFeedback/ReportErrorFeedback';

const useStyles = makeStyles(() => ({
  content: {
    flex: '1 1 auto', // Allow the grid item containing the main content to grow and shrink to fill the available height.
    position: 'relative', // Needed for the small map to be positioned correctly relative to the top left corner of the content container
    height: '100%',
    overflow: 'hidden',
  },
  footer: {
    flex: '0 1 4.5rem',
  },
  imageseries: {
    display: 'flex',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  imageCointainer: {
    height: '100%',
    overflow: 'hidden',
  },
}));

interface IImageViewProps {
  setView: () => void;
  showSnackbarMessage: (message: string) => void;
}

interface IScrollState {
  mousePosition: { x: number; y: number };
  scroll: { x: number; y: number };
}

type ScrollAction =
  | { type: 'mousePosition'; newVal: { x: number; y: number } }
  | { type: 'scroll'; newVal: { x: number; y: number } };

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const isHistoryMode = useRecoilValue(isHistoryModeState);
  const [showReportErrorsScheme, setShowReportErrorsScheme] = useState(false);
  const [isZoomedInImage, setIsZoomedInImage] = useState(false);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState('zoom-in');

  const initialScrollState = {
    mousePosition: { x: 0, y: 0 },
    scroll: { x: 0, y: 0 },
  };

  const scrollReducer = (state: IScrollState, action: ScrollAction) => {
    switch (action.type) {
      case 'mousePosition': {
        return {
          ...state,
          mousePosition: { x: action.newVal.x, y: action.newVal.y },
        };
      }
      case 'scroll': {
        return {
          ...state,
          x: state.scroll.x + action.newVal.x - state.mousePosition.x,
          mousePositionX: action.newVal.x,
          y: state.scroll.y + action.newVal.y - state.mousePosition.y,
          mousePositionY: action.newVal.y,
        };
      }
      default:
        return state;
    }
  };

  const [scrollState, dispatch] = useReducer(scrollReducer, initialScrollState);

  // We add mouse event handlers that lets the user drag the image to scroll. If the user only clicks we zoom in/out.
  useEffect(() => {
    const currentImageContainerRef = imageContainerRef.current;
    if (!currentImageContainerRef) return;

    let shouldScroll = false;
    let mouseMoved = false;

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      dispatch({ type: 'mousePosition', newVal: { x: event.clientX, y: event.clientY } });
      shouldScroll = true;
      mouseMoved = false;
    };

    const onMouseUp = () => {
      shouldScroll = false;
      if (!mouseMoved && !isHistoryMode) {
        setIsZoomedInImage((prevState) => !prevState);
        setCursor((prevState) => (prevState === 'zoom-in' ? 'zoom-out' : 'zoom-in'));
      }
      if (mouseMoved) {
        setCursor('zoom-out');
      }
    };

    const onMouseOut = () => {
      shouldScroll = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouseMoved = true;
      if (shouldScroll) {
        setCursor('grab');
        if (currentImageContainerRef) {
          currentImageContainerRef.scrollLeft =
            scrollState.scroll.x + event.clientX - scrollState.mousePosition.x;
          currentImageContainerRef.scrollTop =
            scrollState.scroll.y + event.clientY - scrollState.mousePosition.y;
        }
        dispatch({ type: 'scroll', newVal: { x: event.clientX, y: event.clientY } });
      }
    };

    const onScroll = (event: WheelEvent) => {
      currentImageContainerRef.scrollLeft = scrollState.scroll.x + event.clientX;
      currentImageContainerRef.scrollTop = scrollState.scroll.y + event.clientY;
      dispatch({ type: 'scroll', newVal: { x: event.clientX, y: event.clientY } });
    };

    currentImageContainerRef.addEventListener('mousedown', onMouseDown);
    currentImageContainerRef.addEventListener('mouseup', onMouseUp);
    currentImageContainerRef.addEventListener('mouseout', onMouseOut);
    currentImageContainerRef.addEventListener('mousemove', onMouseMove);
    currentImageContainerRef.addEventListener('wheel', onScroll);

    return () => {
      currentImageContainerRef.removeEventListener('mousedown', onMouseDown);
      currentImageContainerRef.removeEventListener('mouseup', onMouseUp);
      currentImageContainerRef.removeEventListener('mouseout', onMouseOut);
      currentImageContainerRef.removeEventListener('mousemove', onMouseMove);
      currentImageContainerRef.removeEventListener('wheel', onScroll);
    };
  }, [isHistoryMode]);

  return (
    <TogglesProvider>
      <Grid
        item
        className={classes.content}
        ref={imageContainerRef}
        style={{ cursor: isHistoryMode ? 'initial' : cursor }}
      >
        {isHistoryMode ? (
          <div className={classes.imageseries}>
            {' '}
            <ImageViewer
              exitImageView={setView}
              showMessage={showSnackbarMessage}
              showCloseButton={false}
            />
            <History />
          </div>
        ) : (
          <ImageViewer
            exitImageView={setView}
            showMessage={showSnackbarMessage}
            showCloseButton={true}
            isZoomedInImage={isZoomedInImage}
          />
        )}
        {!isZoomedInImage ? <SmallMapContainer exitImageView={setView} /> : null}
      </Grid>
      <Grid item className={classes.footer}>
        <ImageControlBar
          showMessage={showSnackbarMessage}
          setShowReportErrorsScheme={setShowReportErrorsScheme}
        />
      </Grid>
      {showReportErrorsScheme ? (
        <ReportErrorFeedback setVisible={() => setShowReportErrorsScheme(false)} />
      ) : null}
    </TogglesProvider>
  );
};

export default ImageView;
