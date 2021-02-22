import React, { useEffect, useReducer, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { useRecoilValue } from 'recoil';

import Footer from 'components/Footer/Footer';
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
}));

interface IImageViewProps {
  setView: () => void;
  showSnackbarMessage: (message: string) => void;
}

interface IScrollState {
  clientY: number;
  clientX: number;
  scrollX: number;
  scrollY: number;
}

type ScrollAction =
  | { type: 'clientX'; newVal: number }
  | { type: 'clientY'; newVal: number }
  | { type: 'scrollY'; newVal: number }
  | { type: 'scrollX'; newVal: number };

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const isHistoryMode = useRecoilValue(isHistoryModeState);
  const [showReportErrorsScheme, setShowReportErrorsScheme] = useState(false);
  const [isZoomedInImage, setIsZoomedInImage] = useState(false);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState('zoom-out');

  const initialScrollState = {
    clientX: 0,
    clientY: 0,
    scrollX: 0,
    scrollY: 0,
  };

  const scrollReducer = (state: IScrollState, action: ScrollAction) => {
    switch (action.type) {
      case 'clientX': {
        return {
          ...state,
          clientX: action.newVal,
        };
      }
      case 'clientY': {
        return {
          ...state,
          clientY: action.newVal,
        };
      }
      case 'scrollX': {
        return {
          ...state,
          scrollX: state.scrollX + action.newVal - state.clientX,
          clientX: action.newVal,
        };
      }
      case 'scrollY': {
        return {
          ...state,
          scrollY: state.scrollY + action.newVal - state.clientY,
          clientY: action.newVal,
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
      dispatch({ type: 'clientX', newVal: event.clientX });
      dispatch({ type: 'clientY', newVal: event.clientY });
      shouldScroll = true;
      mouseMoved = false;
    };

    const onMouseUp = () => {
      shouldScroll = false;
      setCursor('zoom-out');
      if (!mouseMoved) setIsZoomedInImage((prevState) => !prevState);
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
            scrollState.scrollX + event.clientX - scrollState.clientX;
          currentImageContainerRef.scrollTop =
            scrollState.scrollY + event.clientY - scrollState.clientY;
        }
        dispatch({ type: 'scrollX', newVal: event.clientX });
        dispatch({ type: 'scrollY', newVal: event.clientY });
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
  }, [imageContainerRef]);

  return (
    <TogglesProvider>
      <Grid item className={classes.content} ref={imageContainerRef} style={{ cursor: cursor }}>
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
        <SmallMapContainer exitImageView={setView} />
      </Grid>
      <Grid item className={classes.footer}>
        <Footer
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
