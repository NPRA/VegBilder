import React, { useEffect } from 'react';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { InputBase, ListSubheader } from '@material-ui/core';
import { createStyles,  makeStyles, WithStyles, withStyles } from '@material-ui/core/styles';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { useRecoilState, useRecoilValue } from 'recoil';

import { CheckmarkIcon, CalendarIcon } from 'components/Icons/Icons';
import {
  availableYearsQuery,
  imagePointQueryParameterState,
  viewQueryParamterState,
  yearQueryParameterState
} from 'recoil/selectors';
import {currentImageTypeState} from 'recoil/atoms';
import Theme from 'theme/Theme';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import { getImagePointLatLng } from 'utilities/imagePointUtilities';

const useStyles = makeStyles((theme) => ({
  yearSelect: {
    borderRadius: theme.shape.borderRadius,
    border: `0.5px solid ${theme.palette.common.grayRegularLight}`,
    color: theme.palette.common.grayRegular,
    width: '8rem',
    '@media (max-width:780px) and (orientation: portrait)': {
      width: '5rem'
    }
  },
  form: {
    '&:hover': {
      '& div': {
        color: Theme.palette.common.orangeDark,
        '& svg': {
          fill: Theme.palette.common.orangeDark,
        },
      },
    },
  },
  filterTypeIcon: {
    position: 'absolute',
    top: '0.6875rem',
    left: '0.75rem',
    fill: theme.palette.common.grayRegular,
    '@media (max-width:780px) and (orientation: portrait)': {
      display: 'none'
    }
  },
  heading: {
    color: theme.palette.common.grayRegular,
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
      marginRight: '5px'
    }
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
    paddingLeft: '2.5rem',
    '@media (max-width:780px) and (orientation: portrait)': {
      paddingLeft: '1rem'
    }
  },
}))(InputBase);

interface IYearSelectorProps {
  showMessage: (message: string) => void;
}

const YearSelector = ({ showMessage }: IYearSelectorProps) => {
  const classes = useStyles();
  const availableYearsForAllImageTypes = useRecoilValue(availableYearsQuery);
  const currentImageType = useRecoilValue(currentImageTypeState);
  const [currentYear, setCurrentYear] = useRecoilState(yearQueryParameterState);
  const [currentView, ] = useRecoilState(viewQueryParamterState);
  const [currentImagePoint, setCurrentImagePoint] = useRecoilState(imagePointQueryParameterState);

  const availableYearsForCurrentImageType = currentImageType === 'panorama' ? availableYearsForAllImageTypes['panorama'] : availableYearsForAllImageTypes['panorama'];

  const fetchNearestImagePointByYearAndLatLng = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder fra valgt år for punktet du er i. Velg et annet år eller et annet punkt.',
    'findImageNearbyCurrentImagePoint'
  );

  useEffect(() => {
    if (typeof currentYear === 'number') {
      if (!availableYearsForCurrentImageType.includes(currentYear)) {
        setCurrentYear("");
        showMessage(`Det fins ingen ${currentImageType}-bilder fra ${currentYear}. Velg en annen bildetype eller et annet år.`)
      } else {
        setCurrentYear(currentYear);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentImageType, availableYearsForCurrentImageType])

  const handleChange = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    const newYear = event.target.value as string;

    if (newYear && newYear !== currentYear) {
      if (newYear === 'Nyeste') {
        if (currentView !== 'image') {
          setCurrentYear('Nyeste');
          setCurrentImagePoint(null);
        }
      } else {
          if (currentImagePoint) {
            const latlng = getImagePointLatLng(currentImagePoint);
            if (latlng) {
              fetchNearestImagePointByYearAndLatLng(latlng, parseInt(newYear));
            };
          } else {
            setCurrentYear(newYear);
          }
      }
    }
  };

  return (
    <FormControl className={classes.form}>
      <Select
        id="year-select"
        value={currentYear}
        onChange={(event) => handleChange(event)}
        className={classes.yearSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
        MenuProps={{ classes: { paper: classes.dropdownStyle }, variant: 'menu' }}
      >
        {/*Bug i ListSubheader gir den en uønsket onClick event som må stoppes.*/}
        <ListSubheader onClickCapture={(e) => e.stopPropagation()}>Periode</ListSubheader>
        <MenuItem
          value={'Nyeste'}
          className={classes.item}
          style={{ color: currentYear === 'Nyeste' ? Theme.palette.common.orangeDark : '' }}
        >
          {currentYear === 'Nyeste' ? <CheckmarkIcon className={classes.checkmarkStyle} /> : null}
          {'Nyeste'}
        </MenuItem>
        <ListSubheader onClickCapture={(e) => e.stopPropagation()}>Årstall</ListSubheader>
        {availableYearsForCurrentImageType.map((year) => (
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
      <div className={classes.filterTypeIcon}>
        <CalendarIcon />
      </div>
    </FormControl>
  );
};

export default YearSelector;
