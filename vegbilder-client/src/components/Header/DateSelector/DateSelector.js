import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase, ListSubheader } from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { useImageSeries } from 'contexts/ImageSeriesContext';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import Theme from 'theme/Theme';
import { CheckmarkIcon } from 'components/Icons/Icons';
import { getFormattedDateString } from 'utilities/imagePointUtilities';

const CustomInput = withStyles((theme) => ({
  input: {
    paddingTop: '0.8125rem',
    paddingBottom: '0.8125rem',
    paddingLeft: '0.8125rem',
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  imageSeriesSelect: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    color: theme.palette.secondary.contrastText,
    width: '10rem',
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
  },
  dropdownStyle: {
    marginTop: '4.3rem',
  },
  item: {
    color: theme.palette.common.grayIcons,
    padding: '0.25rem 2.125rem',
    '&:hover': {
      color: theme.palette.common.orangeDark,
    },
    '& $checkmarkStyle': {
      display: 'block',
    },
  },
  checkmarkStyle: {
    position: 'absolute',
    left: '0.75rem',
    display: 'none',
  },
}));

const iconStyles = {
  selectIcon: {
    color: '#ececec',
  },
};

const CustomExpandMoreIcon = withStyles(iconStyles)(({ className, classes, ...rest }) => (
  <ExpandMoreIcon {...rest} className={`${className} ${classes.selectIcon}`} />
));

const DateSelector = () => {
  const classes = useStyles();
  const { availableImageSeries, currentImageSeries, setCurrentImageSeries } = useImageSeries();
  const { setCommand } = useCommand();
  const { resetFilteredImagePoints } = useFilteredImagePoints();

  return availableImageSeries.length <= 1 ? null : (
    <FormControl>
      <Select
        id="imageseries-select"
        value={currentImageSeries.date}
        onChange={(event) => {
          const selectedSeries = {
            roadReference: currentImageSeries.roadReference, // All the image series which can be selected have the same road reference. Only the date differs.
            date: event.target.value,
          };
          setCurrentImageSeries(selectedSeries);
          resetFilteredImagePoints();
          setCommand(commandTypes.selectNearestImagePointToCurrentImagePoint);
        }}
        className={classes.imageSeriesSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
        MenuProps={{ classes: { paper: classes.dropdownStyle }, variant: 'menu' }}
      >
        <ListSubheader>Dato</ListSubheader>
        {availableImageSeries.map((series) => (
          <MenuItem
            key={series}
            value={series}
            className={classes.item}
            style={{
              color: series === currentImageSeries.date ? Theme.palette.common.orangeDark : '',
            }}
          >
            {series === currentImageSeries.date && (
              <CheckmarkIcon className={classes.checkmarkStyle} />
            )}
            {getFormattedDateString(series)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DateSelector;