import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase, ListSubheader } from '@material-ui/core';
import { createStyles, fade, makeStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useRecoilValue, useRecoilState } from 'recoil';

import { CalendarIcon, CheckmarkIcon } from 'components/Icons/Icons';
import { useCommand, commandTypes } from 'contexts/CommandContext';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { availableYearsQuery } from 'recoil/selectors';
import useQueryParamState from 'hooks/useQueryParamState';
import { currentYearState, nyesteState } from 'recoil/atoms';
import Theme from 'theme/Theme';

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

const iconStyles = () =>
  createStyles({
    selectIcon: {
      color: '#ececec',
    },
  });

interface Props extends WithStyles<typeof iconStyles> {
  className: string;
}

const CustomExpandMoreIcon = withStyles(iconStyles)(({ className, classes, ...rest }: Props) => {
  return <ExpandMoreIcon {...rest} className={`${className} ${classes.selectIcon}`} />;
});

const CustomInput = withStyles(() => ({
  input: {
    paddingTop: '0.8125rem',
    paddingBottom: '0.8125rem',
    paddingLeft: '2.3125rem',
  },
}))(InputBase);

const YearSelector = () => {
  const classes = useStyles();
  const [, setQueryParamYear] = useQueryParamState('year');
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const { setCommand } = useCommand();
  const availableYears = useRecoilValue(availableYearsQuery);
  const [currentYear, setCurrentYear] = useRecoilState(currentYearState);
  const [nyeste, setNyeste] = useRecoilState(nyesteState);

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    if (event) {
      const newYear = event.target.value as string;
      if (newYear === 'Nyeste') {
        setNyeste(true);
        return;
      } else {
        setQueryParamYear(newYear);
        setCurrentYear(parseInt(newYear));
        resetFilteredImagePoints();
        setCommand(commandTypes.selectNearestImagePointToCurrentImagePoint);
        setNyeste(false);
      }
    }
  };

  return (
    <FormControl>
      <Select
        id="year-select"
        value={nyeste ? 'Nyeste' : currentYear}
        onChange={(event) => handleChange(event)}
        className={classes.yearSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
        MenuProps={{ classes: { paper: classes.dropdownStyle }, variant: 'menu' }}
      >
        <ListSubheader>Periode</ListSubheader>
        <MenuItem
          value={'Nyeste'}
          className={classes.item}
          style={{ color: nyeste ? Theme.palette.common.orangeDark : '' }}
        >
          {nyeste ? <CheckmarkIcon className={classes.checkmarkStyle} /> : null}
          {'Nyeste'}
        </MenuItem>
        <ListSubheader>Årstall</ListSubheader>
        {availableYears.map((year) => (
          <MenuItem
            key={year}
            value={year}
            className={classes.item}
            style={{
              color: year === currentYear && !nyeste ? Theme.palette.common.orangeDark : '',
            }}
          >
            {year === currentYear && !nyeste ? (
              <CheckmarkIcon className={classes.checkmarkStyle} />
            ) : null}
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
