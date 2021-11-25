import React, { useEffect, useReducer, useRef, useState } from 'react';
import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/styles';
import { useRecoilValue } from 'recoil';
import ImageControlBar from './ImageControlBar/ImageControlBar';
import ImageViewer from './ImageViewer/ImageViewer';
import { currentImagePointState } from 'recoil/atoms';
import History from './History/History';
import ReportErrorFeedback from './ReportErrorFeedback/ReportErrorFeedback';
import { DEFAULT_TIME_BETWEEN_IMAGES, DEFAULT_TIME_BETWEEN_IMAGES_360 } from 'constants/defaultParamters';
import CloseButton from 'components/CloseButton/CloseButton';
import SideControlBar from './SideControlBar/SideControlBar';
import { getImageType } from "utilities/imagePointUtilities";


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
    position: 'relative',
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
  | { type: 'reset' }
  | { type: 'init'; newVal: { x: number; y: number } };

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const [isHistoryMode, setIsHistoryMode] = useState(false);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const currentImageType = currentImagePoint ? getImageType(currentImagePoint) : '';
  const [showReportErrorsScheme, setShowReportErrorsScheme] = useState(false);
  const [isZoomedInImage, setIsZoomedInImage] = useState(false);
  const imageContainerRef = useRef<HTMLImageElement>(null);
  const [cursor, setCursor] = useState('zoom-in');
  const [timeBetweenImages, setTimeBetweenImages] = useState(DEFAULT_TIME_BETWEEN_IMAGES);
  const [panoramaIsActive, setPanoramaIsActive] = useState(false);
  const [meterLineVisible, setMeterLineVisible] = useState(false);

  const maxScrollHeight =
    (document.getElementById('vegbilde')?.clientHeight || 1000) -
    175 -
    document.body.clientHeight / 2;

  const maxScrollWidth =
    (document.getElementById('vegbilde')?.clientWidth || 1000) - document.body.clientWidth;

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
        let newScrollLeft = state.scroll.x - action.newVal.x + state.mousePosition.x;
        let newScrollTop = state.scroll.y - action.newVal.y + state.mousePosition.y;

        if (newScrollLeft >= maxScrollWidth || newScrollLeft < 0) newScrollLeft = state.scroll.x;
        if (newScrollTop >= maxScrollHeight || newScrollTop < 0) newScrollTop = state.scroll.y;

        const currentImageContainerRef = imageContainerRef.current;
        if (currentImageContainerRef) {
          currentImageContainerRef.scrollLeft = newScrollLeft;
          currentImageContainerRef.scrollTop = newScrollTop;
        }
        return {
          ...state,
          scroll: {
            x: newScrollLeft,
            y: newScrollTop,
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
      case 'init': {
        const currentImageContainerRef = imageContainerRef.current;
        if (currentImageContainerRef) {
          currentImageContainerRef.scrollLeft = action.newVal.x;
          currentImageContainerRef.scrollTop = action.newVal.y;
        }
        return {
          ...state,
          scroll: {
            x: action.newVal.x,
            y: action.newVal.y,
          },
          mousePosition: { x: action.newVal.x, y: action.newVal.y },
        };
      }
      default:
        return state;
    }
  };

  const [, dispatch] = useReducer(scrollReducer, initialScrollState);

  useEffect(() => {
    if (currentImageType === 'panorama') {
      setTimeBetweenImages(DEFAULT_TIME_BETWEEN_IMAGES_360);
    } else {
      setTimeBetweenImages(DEFAULT_TIME_BETWEEN_IMAGES);
    };
    if (currentImageType !== 'panorama') {
      setPanoramaIsActive(false);
    };
  }, [currentImageType])

  useEffect(() => {
    isZoomedInImage ? setCursor('grab') : setCursor('zoom-in');
  }, [isZoomedInImage]);

  useEffect(() => {
    if (isZoomedInImage) setMeterLineVisible(false);
  }, [isZoomedInImage]);

  // We add mouse event handlers that lets the user drag the image to scroll. If the user only clicks we zoom in/out.
  // Not used for 360 images.
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

    const onMouseUp = (event: MouseEvent) => {
      shouldScroll = false;
      if (!mouseMoved && !isHistoryMode) {
        const isCurrentlyZoomedInImage = isZoomedInImage;
        if (isCurrentlyZoomedInImage) {
          // zoom out and reset state
          dispatch({ type: 'reset' });
        }

        setIsZoomedInImage((prevState) => !prevState);

        if (!isCurrentlyZoomedInImage) {
          // zoom in and init scroll/mouse position to where the user clicked
          // this have to come after we set the image to a zoomed in state in order to update the
          // state of the big image element.
          dispatch({
            type: 'init',
            newVal: {
              x: event.clientX,
              y: event.clientY,
            },
          });
        }
      }
      if (mouseMoved && isZoomedInImage) {
        setCursor('grab');
      }
    };

    const onMouseOut = () => {
      shouldScroll = false;
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouseMoved = true;
      if (shouldScroll && isZoomedInImage) {
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
  }, [isZoomedInImage, isHistoryMode, currentImageType]);

  const handleZoomOut = () => {
    setIsZoomedInImage(false);
  };

  return (
    <>
      <Grid item className={classes.content}>
      {isHistoryMode ? 
          (
            <div className={classes.imageseries}>
            <ImageViewer
              meterLineVisible={meterLineVisible}
              timeBetweenImages={timeBetweenImages}
              isHistoryMode={isHistoryMode}
              showMessage={showSnackbarMessage}
              panoramaIsActive={panoramaIsActive}
            />
            <History setIsHistoryMode={setIsHistoryMode} />
          </div>
          ) 
          : (
            <div
            className={classes.imageCointainer}
            style={{ cursor }}
            ref={!panoramaIsActive ? imageContainerRef : null}
          >
            <ImageViewer
              meterLineVisible={meterLineVisible}
              timeBetweenImages={timeBetweenImages}
              isHistoryMode={isHistoryMode}
              showMessage={showSnackbarMessage}
              isZoomedInImage={isZoomedInImage}
              panoramaIsActive={panoramaIsActive}
            />
          </div>
          )}
       
        <SideControlBar
          setView={setView}
          isZoomedInImage={isZoomedInImage}
          imagePoint={currentImagePoint}
          isHistoryMode={isHistoryMode}
        />
      </Grid>
      <Grid item className={classes.footer}>
        <ImageControlBar
          meterLineVisible={meterLineVisible}
          setMeterLineVisible={setMeterLineVisible}
          showMessage={showSnackbarMessage}
          setShowReportErrorsScheme={setShowReportErrorsScheme}
          timeBetweenImages={timeBetweenImages}
          setTimeBetweenImages={setTimeBetweenImages}
          isZoomedInImage={isHistoryMode ? false : isZoomedInImage}
          setIsZoomedInImage={setIsZoomedInImage}
          isHistoryMode={isHistoryMode}
          setIsHistoryMode={setIsHistoryMode}
          panoramaIsActive={panoramaIsActive}
          setPanoramaIsActive={setPanoramaIsActive}
          currentImagePoint={currentImagePoint}
        />
      </Grid>
      {showReportErrorsScheme ? (
        <ReportErrorFeedback setVisible={() => setShowReportErrorsScheme(false)} />
      ) : null}
      {isZoomedInImage ? <CloseButton onClick={handleZoomOut} positionToTop={'7.1rem'} /> : null}
    </>
  );
};

export default ImageView;
