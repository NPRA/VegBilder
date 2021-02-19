import React, { useRef, useState } from 'react';
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
  const [isScrolling, setIsScrolling] = useState(false);
  const [clientX, setClientX] = useState(0);
  const [scrollX, setScrollX] = useState(0);

  const ref = useRef<HTMLImageElement>(null);

  const onMouseDown = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    setClientX(event.clientX);
    setIsScrolling(true);
  };

  const onMouseUp = () => {
    setIsScrolling(false);
  };

  const onMouseMove = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.preventDefault();
    if (isScrolling) {
      if (ref.current) {
        ref.current.scrollLeft = scrollX + event.clientX - clientX;
        ref.current.scrollTop = 200;
        console.log(ref.current.scrollLeft);
      }
      setScrollX(scrollX + event.clientX - clientX);
      setClientX(event.clientX);
    }
  };

  return (
    <TogglesProvider>
      <Grid
        item
        className={classes.content}
        onMouseDown={(event) => onMouseDown(event)}
        onMouseUp={() => onMouseUp}
        onMouseMove={(event) => onMouseMove(event)}
        ref={ref}
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
