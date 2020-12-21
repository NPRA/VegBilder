import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase } from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { CalendarIcon } from '../Icons/Icons';
import { useYearFilter } from '../../contexts/YearFilterContext';
import { useLoadedImagePoints } from '../../contexts/LoadedImagePointsContext';
import { useCommand, commandTypes } from '../../contexts/CommandContext';
import { useFilteredImagePoints } from '../../contexts/FilteredImagePointsContext';
import { availableYears } from '../../configuration/config';

const CustomInput = withStyles((theme) => ({
  input: {
    paddingTop: '0.8125rem',
    paddingBottom: '0.8125rem',
    paddingLeft: '2.3125rem',
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  yearSelect: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    color: theme.palette.secondary.contrastText,
    width: '8.5rem',
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
  },
  calendarIcon: {
    position: 'absolute',
    top: '0.6875rem',
    left: '0.75rem',
  },
}));

const iconStyles = {
  selectIcon: {
    color: '#ececec',
  },
};

const CustomExpandMoreIcon = withStyles(iconStyles)(({ className, classes, ...rest }) => {
  return <ExpandMoreIcon {...rest} className={`${className} ${classes.selectIcon}`} />;
});

const YearSelector = () => {
  const classes = useStyles();
  const { year, setYear } = useYearFilter();
  const { resetLoadedImagePoints } = useLoadedImagePoints();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { setCommand } = useCommand();

  return (
    <FormControl>
      <Select
        id="year-select"
        value={year}
        onChange={(event) => {
          setYear(event.target.value);
          resetLoadedImagePoints();
          resetFilteredImagePoints();
          setCommand(commandTypes.selectNearestImagePointToCurrentImagePoint);
        }}
        className={classes.yearSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
      >
        {availableYears.map((y) => (
          <MenuItem key={y} value={y}>
            {y}
          </MenuItem>
        ))}
      </Select>
      <div className={classes.calendarIcon}>
        <CalendarIcon />
      </div>
    </FormControl>
  );
};

export default YearSelector;
