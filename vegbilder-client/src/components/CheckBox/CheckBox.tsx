import { makeStyles, FormControlLabel, Checkbox } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginTop: 0,
  },
  checkbox: {
    margin: 0,
    padding: 0,
    backgroundColor: 'transparent',
    color: theme.palette.primary.contrastText,
  },
}));

interface ICheckBoxProps {
  handleChange: () => void;
  label: string;
  checked?: boolean;
}

const CheckBox = ({ handleChange, label, checked }: ICheckBoxProps) => {
  const classes = useStyles();

  return (
    <FormControlLabel
      className={classes.formControl}
      control={<Checkbox checked={checked} className={classes.checkbox} onChange={handleChange} />}
      label={label}
    />
  );
};

export default CheckBox;
