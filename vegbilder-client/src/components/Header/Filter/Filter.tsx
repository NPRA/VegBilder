import {
  makeStyles,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from '@material-ui/core';
import React, { useState } from 'react';

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
}));

interface IFilterProps {
  openMenu: boolean;
  setOpenMenu: (openMenu: boolean) => void;
}

const Filter = ({ openMenu, setOpenMenu }: IFilterProps) => {
  const classes = useStyles();

  const [vegtyperChecked, setVegtyperChecked] = useState({ riksveger: false, fylkesveger: false });

  const [cameraTypeChecked, setCameraTypeChecked] = useState({
    panorama: false,
    dekkekamera: false,
    planar: true,
  });

  const handleChange = () => {};

  const { riksveger, fylkesveger } = vegtyperChecked;
  const { panorama, dekkekamera, planar } = cameraTypeChecked;

  return (
    <>
      {openMenu && (
        <div className={classes.menu} tabIndex={1}>
          <FormControl component="fieldset">
            <FormLabel> Vegtyper </FormLabel>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox checked={riksveger} onChange={handleChange} name="riksveger" />}
                label="Riksveger"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={fylkesveger} onChange={handleChange} name="Fylkesveger" />
                }
                label="Fylkesveger"
              />
            </FormGroup>
            <FormGroup>
              <FormLabel> Kameratype </FormLabel>
              <FormControlLabel
                control={<Checkbox checked={panorama} onChange={handleChange} name="panorama" />}
                label="360"
              />
              <FormControlLabel
                control={
                  <Checkbox checked={dekkekamera} onChange={handleChange} name="dekkekamera" />
                }
                label="Dekkekamera"
              />
              <FormControlLabel
                control={<Checkbox checked={planar} onChange={handleChange} name="planar" />}
                label="Planar"
              />
            </FormGroup>
          </FormControl>
        </div>
      )}
    </>
  );
};

export default Filter;
