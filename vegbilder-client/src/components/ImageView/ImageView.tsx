import React, { useEffect, useReducer, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { useRecoilValue } from 'recoil';

import ImageControlBar from './ImageControlBar/ImageControlBar';
import SmallMapContainer from './SmallMapContainer/SmallMapContainer';
import ImageViewer from './ImageViewer/ImageViewer';
import { isHistoryModeState } from 'recoil/atoms';
import History from './History/History';
import ReportErrorFeedback from './ReportErrorFeedback/ReportErrorFeedback';
import { DEFAULT_TIME_BETWEEN_IMAGES } from 'constants/defaultParamters';

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
  | { type: 'scroll'; newVal: { x: number; y: number } }
  | { type: 'reset' };

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const isHistoryMode = useRecoilValue(isHistoryModeState);
  const [showReportErrorsScheme, setShowReportErrorsScheme] = useState(false);
  const [isZoomedInImage, setIsZoomedInImage] = useState(false);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState('zoom-in');
  const [timeBetweenImages, setTimeBetweenImages] = useState(DEFAULT_TIME_BETWEEN_IMAGES);
  const [miniMapVisible, setMiniMapVisible] = useState(true);
  const [meterLineVisible, setMeterLineVisible] = useState(false);

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
        const currentImageContainerRef = imageContainerRef.current;
        if (currentImageContainerRef) {
          currentImageContainerRef.scrollLeft =
            state.scroll.x - action.newVal.x + state.mousePosition.x;
          currentImageContainerRef.scrollTop =
            state.scroll.y - action.newVal.y + state.mousePosition.y;
        }
        //console.log('action.newVal  ' + (state.scroll.x - action.newVal.x + state.mousePosition.x));
        return {
          ...state,
          scroll: {
            x: state.scroll.x - action.newVal.x + state.mousePosition.x,
            y: state.scroll.y - action.newVal.y + state.mousePosition.y,
          },
          mousePosition: { x: action.newVal.x, y: action.newVal.y },
        };
      }
      case 'reset': {
        return {
          scroll: {
            x: 0,
            y: 0,
          },
          mousePosition: { x: 0, y: 0 },
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
        setCursor((prevState) => (prevState === 'grab' ? 'zoom-in' : 'grab'));
      }
      if (mouseMoved) {
        setCursor('grab');
      }
    };

    const onMouseOut = () => {
      shouldScroll = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouseMoved = true;
      if (shouldScroll) {
        setCursor('grabbing');
        if (currentImageContainerRef) {
          dispatch({ type: 'scroll', newVal: { x: event.clientX, y: event.clientY } });
        }
      }
    };

    currentImageContainerRef.addEventListener('mousedown', onMouseDown);
    currentImageContainerRef.addEventListener('mouseup', onMouseUp);
    currentImageContainerRef.addEventListener('mouseout', onMouseOut);
    currentImageContainerRef.addEventListener('mousemove', onMouseMove);
    return () => {
      currentImageContainerRef.removeEventListener('mousedown', onMouseDown);
      currentImageContainerRef.removeEventListener('mouseup', onMouseUp);
      currentImageContainerRef.removeEventListener('mouseout', onMouseOut);
      currentImageContainerRef.removeEventListener('mousemove', onMouseMove);
    };
  }, []);

  return (
    <>
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
              meterLineVisible={meterLineVisible}
              timeBetweenImages={timeBetweenImages}
              exitImageView={setView}
              showMessage={showSnackbarMessage}
              showCloseButton={false}
            />
            <History />
          </div>
        ) : (
          <ImageViewer
            meterLineVisible={meterLineVisible}
            timeBetweenImages={timeBetweenImages}
            exitImageView={setView}
            showMessage={showSnackbarMessage}
            showCloseButton={true}
            isZoomedInImage={isZoomedInImage}
          />
        )}
        {miniMapVisible && !isZoomedInImage ? <SmallMapContainer exitImageView={setView} /> : null}
      </Grid>
      <Grid item className={classes.footer}>
        <ImageControlBar
          miniMapVisible={miniMapVisible}
          meterLineVisible={meterLineVisible}
          setMeterLineVisible={setMeterLineVisible}
          setMiniMapVisible={setMiniMapVisible}
          showMessage={showSnackbarMessage}
          setShowReportErrorsScheme={setShowReportErrorsScheme}
          timeBetweenImages={timeBetweenImages}
          setTimeBetweenImages={setTimeBetweenImages}
        />
      </Grid>
      {showReportErrorsScheme ? (
        <ReportErrorFeedback setVisible={() => setShowReportErrorsScheme(false)} />
      ) : null}
    </>
  );
};

export default ImageView;
