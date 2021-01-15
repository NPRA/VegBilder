import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';

import { useImageSeries } from 'contexts/ImageSeriesContext';
import Theme from 'theme/Theme';

const useStyles = makeStyles((theme) => ({
  content: {
    padding: '1rem',
    height: '100%',
    width: '40%',
    maxWidth: '35rem',
    backgroundColor: '#444F55',
    color: '#c4c4c4',
    display: 'flex',
    justifyContent: 'center',
  },
  header: {
    margin: 0,
  },
}));

const ImageSeriesView = () => {
  const { availableImageSeries, currentImageSeries, setCurrentImageSeries } = useImageSeries();
  const classes = useStyles();

  console.log(currentImageSeries);

  console.log(availableImageSeries);

  return (
    <Paper className={classes.content} square={true}>
      <h4 className={classes.header}>Vegbilder fra samme sted</h4>
    </Paper>
  );
};

export default ImageSeriesView;
