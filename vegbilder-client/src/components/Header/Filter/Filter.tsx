import {
  makeStyles,
  WithStyles,
  withStyles,
  createStyles,
  FormControl,
  Select,
  ListSubheader,
  MenuItem,
  InputBase
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Theme from 'theme/Theme';
import useFetchNearestImagePoint from 'hooks/useFetchNearestImagePoint';
import React, { useState } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import {
  currentImagePointState,
  currentLatLngZoomState,
  loadedImagePointsState,
} from 'recoil/atoms';
import {imageTypeQueryParameterState} from 'recoil/selectors';
import { imageType } from 'types';
import { CheckmarkIcon } from "components/Icons/Icons";
import  { CameraAlt } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  menu: {
    position: 'absolute',
    marginTop: '1.35rem',
    left: 0,
    color: theme.palette.common.grayRegular,
    backgroundColor: theme.palette.common.grayDarker,
    borderRadius: '10px',
    padding: '1rem',
    width: '100%',
    border: `0.5px solid ${theme.palette.common.grayDark}`,
    maxHeight: '40rem',
    overflowY: 'auto',
    boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
    '&::-webkit-scrollbar': {
      backgroundColor: theme.palette.common.grayDarker,
      width: '1rem',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: theme.palette.common.grayDarker,
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: theme.palette.common.grayRegular,
      borderRadius: '1rem',
      border: `4px solid ${theme.palette.common.grayDarker}`,
    },
    '&::-webkit-scrollbar-button': {
      display: 'none',
    },
  },
  form: {
    '&:hover': {
      '& div': {
        color: Theme.palette.common.orangeDark,
        '& svg': {
          color: Theme.palette.common.orangeDark,
        },
      },
    },
  },
  cameraSelect: {
    borderRadius: theme.shape.borderRadius,
    border: `0.5px solid ${theme.palette.common.grayRegularLight}`,
    color: theme.palette.common.grayRegular,
    width: '8rem',
    '@media (max-width:780px) and (orientation: portrait)': {
      width: '5rem'
    }
  },
  filterTypeIcon: {
    position: 'absolute',
    top: '0.6875rem',
    left: '0.75rem',
    '@media (max-width:780px) and (orientation: portrait)': {
      display: 'none'
    }
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
      marginRight: '5px'
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
    paddingLeft: '2.5rem',
    '@media (max-width:780px) and (orientation: portrait)': {
      paddingLeft: '1rem'
    }
  },
}))(InputBase);

interface IFilterProps {
  showMessage: (message: string) => void;
}

const Filter = ({ showMessage }: IFilterProps) => {
  const classes = useStyles();
  const [currentImageType, setCurrentImageType] = useRecoilState(imageTypeQueryParameterState);
  const currentCoordinates = useRecoilValue(currentLatLngZoomState);
  const currentImagePoint = useRecoilValue(currentImagePointState);
  const setLoadedImagePoits = useSetRecoilState(loadedImagePointsState);
  const fetchNearestImagePoint = useFetchNearestImagePoint(
    showMessage,
    'Fant ingen bilder i nærheten med det kamerafilteret.'
  );

  const [vegtyperChecked, setVegtyperChecked] = useState({ riksveger: false, fylkesveger: false });

  const handleCameraTypeFilterCheck = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ) => {
    let imageType = event.target.value as imageType;
    setCurrentImageType(imageType);
    if (currentImagePoint) {
      // if we already have an image preview, we need to fetch new image points and find a new image preview for that camera filter
      // otherwise, we dont have to do anything besides switching map layer
      setLoadedImagePoits(null); // reset state
      const latlng = { lat: currentCoordinates.lat, lng: currentCoordinates.lng };
      fetchNearestImagePoint(latlng, currentImagePoint.properties.AAR, imageType);
    }
  };

  const { riksveger, fylkesveger } = vegtyperChecked;

  return (
    <>
      {
        <FormControl className={classes.form}>
          <Select
          id="cameraType-select"
          value={currentImageType}
          className={classes.cameraSelect}
          input={<CustomInput/>}
          IconComponent={CustomExpandMoreIcon}
          onChange={(event) => handleCameraTypeFilterCheck(event)}
          MenuProps={{ classes: { paper: classes.dropdownStyle }, variant: 'menu' }}
          >
            {/*Bug i ListSubheader gir den en uønsket onClick event som må stoppes.*/}
            <ListSubheader onClickCapture={(e) => e.stopPropagation()}>Bildetype</ListSubheader>
            <MenuItem
              value={'planar'}
              className={classes.item}
              style={{color: currentImageType === 'planar' ? Theme.palette.common.orangeDark : ''}}>
              {currentImageType === 'planar' ? <CheckmarkIcon className={classes.checkmarkStyle}/> : null}
                {'Planar'}
            </MenuItem>
            <MenuItem
              value={'360'}
              className={classes.item}
              style={{color: currentImageType === '360' ? Theme.palette.common.orangeDark : ''}}>
              {currentImageType === '360' ? <CheckmarkIcon className={classes.checkmarkStyle}/> : null}
                {'360'}
            </MenuItem>
        </Select>
          <div className={classes.filterTypeIcon}>
            <CameraAlt/>
          </div>
      </FormControl>
        }
    </>
  );
};

export default Filter;
