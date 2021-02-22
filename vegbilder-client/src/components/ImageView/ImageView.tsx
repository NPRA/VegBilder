import React, { useEffect, useRef, useState } from 'react';
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
    overflow: 'auto',
    cursor: 'grab',
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

const ImageView = ({ setView, showSnackbarMessage }: IImageViewProps) => {
  const classes = useStyles();
  const isHistoryMode = useRecoilValue(isHistoryModeState);
  const [showReportErrorsScheme, setShowReportErrorsScheme] = useState(false);
  const [isEnlargedImage, setIsEnLargedImage] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [scrollX, setScrollX] = useState(0);
  const [clientY, setClientY] = useState(0);
  const [scrollY, setScrollY] = useState(0);

  const containerRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const currentCardRef = containerRef.current;
    if (!currentCardRef) return;

    let shouldScroll = false;
    let mouseMoved = false;

    const onMouseDown = (event: MouseEvent) => {
      event.preventDefault();
      setClientX(event.clientX);
      setClientY(event.clientY);
      shouldScroll = true;
      mouseMoved = false;
    };

    const onMouseUp = () => {
      shouldScroll = false;
      if (!mouseMoved) setIsEnLargedImage((prevState) => !prevState);
    };

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      mouseMoved = true;
      if (shouldScroll) {
        if (containerRef.current) {
          containerRef.current.scrollLeft = scrollX + event.clientX - clientX;
          containerRef.current.scrollTop = scrollY + event.clientY - clientY;
        }
        setScrollX((prevState) => prevState + event.clientX - clientX);
        setClientX(event.clientX);
        setScrollY((prevState) => prevState + event.clientY - clientY);
        setClientY(event.clientY);
      }
    };

    currentCardRef.addEventListener('mousedown', (event) => onMouseDown(event));
    currentCardRef.addEventListener('mouseup', () => onMouseUp());
    currentCardRef.addEventListener('mousemove', (event) => onMouseMove(event));

    return () => {
      currentCardRef.removeEventListener('mousedown', (event) => onMouseDown(event));
      currentCardRef.removeEventListener('mouseup', () => onMouseUp());
      currentCardRef.removeEventListener('mousemove', (event) => onMouseMove(event));
    };
  }, [containerRef]);

  return (
    <TogglesProvider>
      <Grid item className={classes.content} ref={containerRef}>
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
