import React from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase, ListSubheader } from '@material-ui/core';
import { createStyles, fade, makeStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useRecoilValue } from 'recoil';

import { CalendarIcon, CheckmarkIcon } from 'components/Icons/Icons';
import { useFilteredImagePoints } from 'contexts/FilteredImagePointsContext';
import { availableYearsQuery } from 'recoil/selectors';
import { currentYearState } from 'recoil/atoms';
import Theme from 'theme/Theme';
import { useCurrentImagePoint } from 'contexts/CurrentImagePointContext';
import useSetCurrentYear from 'hooks/useSetCurrentYear';
import { getImagePointLatLng } from 'utilities/imagePointUtilities';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';

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

interface IYearSelectorProps {
  showMessage: (message: string) => void;
}

const YearSelector = ({ showMessage }: IYearSelectorProps) => {
  const classes = useStyles();
  const { resetFilteredImagePoints } = useFilteredImagePoints();
  const availableYears = useRecoilValue(availableYearsQuery);
  const currentYear = useRecoilValue(currentYearState);
  const { currentImagePoint, unsetCurrentImagePoint } = useCurrentImagePoint();
  const setCurrentYear = useSetCurrentYear();
  const fetchNearestImagePointByYearAndLatLng = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder fra valgt år på dette stedet.'
  );

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const prevYear = currentYear;
    const newYear = event.target.value as string;
    if (newYear && newYear !== currentYear) {
      const searchParams = new URLSearchParams(window.location.search);
      const view = searchParams.get('view');
      if (newYear === 'Nyeste') {
        if (view !== 'image') {
          setCurrentYear('Nyeste');
          unsetCurrentImagePoint();
        }
      } else {
        setCurrentYear(parseInt(newYear));
        if (prevYear !== 'Nyeste') {
          resetFilteredImagePoints();
        }
        const coordinates = getImagePointLatLng(currentImagePoint);
        if (coordinates) {
          fetchNearestImagePointByYearAndLatLng(coordinates, parseInt(newYear));
        }
      }
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
        <ListSubheader>Periode</ListSubheader>
        <MenuItem
          value={'Nyeste'}
          className={classes.item}
          style={{ color: currentYear === 'Nyeste' ? Theme.palette.common.orangeDark : '' }}
        >
          {currentYear === 'Nyeste' ? <CheckmarkIcon className={classes.checkmarkStyle} /> : null}
          {'Nyeste'}
        </MenuItem>
        <ListSubheader>Årstall</ListSubheader>
        {availableYears.map((year) => (
          <MenuItem
            key={year}
            value={year}
            className={classes.item}
            selected={year === currentYear}
            style={{ color: year === currentYear ? Theme.palette.common.orangeDark : '' }}
          >
            {year === currentYear ? <CheckmarkIcon className={classes.checkmarkStyle} /> : null}
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
