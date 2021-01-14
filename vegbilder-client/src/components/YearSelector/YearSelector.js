import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase, ListSubheader } from '@material-ui/core';
import { fade, makeStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useRecoilValue, useRecoilState } from 'recoil';

import { CalendarIcon, CheckmarkIcon } from 'components/Icons/Icons';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { availableYearsQuery } from 'recoil/selectors';
import useQueryParamState from 'hooks/useQueryParamState';
import { currentYearState } from 'recoil/atoms';
import Theme from 'theme/Theme';

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
    width: '10rem',
    '&:hover': {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
  },
  calendarIcon: {
    position: 'absolute',
    top: '0.6875rem',
    left: '0.75rem',
  },
  heading: {
    color: theme.palette.common.grayIcons,
    textTransform: 'uppercase',
    padding: '0.9375rem 1.625rem',
    fontWeight: 700,
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
  dropdownStyle: {
    marginTop: '4.3rem',
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
  const [, setYear] = useQueryParamState('year');
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { setCommand } = useCommand();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);

  const sortedYears = availableYears.slice();
  sortedYears.sort((a, b) => b - a);

  const handleChange = (event) => {
    const newYear = event.target.value;
    if (parseInt(newYear) !== currentYear) {
      setYear(newYear);
      setCurrentYear(parseInt(newYear));
      resetFilteredImagePoints();
      setCommand(commandTypes.selectNearestImagePointToCurrentImagePoint);
    }
  };

  return (
    <FormControl>
      <Select
        id="year-select"
        value={currentYear}
        onChange={(event) => handleChange(event)}
        className={classes.yearSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
        MenuProps={{ classes: { paper: classes.dropdownStyle }, variant: 'menu' }}
      >
        <ListSubheader>Årstall</ListSubheader>
        {sortedYears.map((year) => (
          <MenuItem
            key={year}
            value={year}
            className={classes.item}
            style={{ color: year === currentYear ? Theme.palette.common.orangeDark : '' }}
          >
            {year === currentYear && <CheckmarkIcon className={classes.checkmarkStyle} />}
            {year}
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
