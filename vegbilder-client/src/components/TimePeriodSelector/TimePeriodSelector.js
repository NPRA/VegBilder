import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputBase } from "@material-ui/core";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { CalendarIcon } from "../Icons/Icons";

const periods = {
  twenty: "2020",
  nineteen: "2019",
  eightteen: "2018",
};

const CustomInput = withStyles((theme) => ({
  input: {
    height: "1rem",
    paddingTop: "0.8125rem",
    paddingBottom: "0.8125rem",
    paddingLeft: "2.3125rem",
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  timePeriodSelect: {
    borderRadius: "0.5rem",
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.secondary.contrastText,
    width: "8.5rem",
  },
  calendarIcon: {
    position: "absolute",
    top: "0.6875rem",
    left: "0.75rem",
  },
}));

const iconStyles = {
  selectIcon: {
    color: "#ececec",
  },
};
const CustomExpandMoreIcon = withStyles(iconStyles)(
  ({ className, classes, ...rest }) => {
    return (
      <ExpandMoreIcon
        {...rest}
        className={`${className} ${classes.selectIcon}`}
      />
    );
  }
);

export default function TimePeriodSelector() {
  const classes = useStyles();
  const [period, setPeriod] = React.useState(periods.twenty);

  console.log(`Tidsperiode: ${period}`);

  return (
    <FormControl>
      <Select
        id="year-select"
        value={period}
        onChange={(event) => setPeriod(event.target.value)}
        className={classes.timePeriodSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
      >
        <MenuItem value={periods.twenty}>{periods.twenty}</MenuItem>
        <MenuItem value={periods.nineteen}>{periods.nineteen}</MenuItem>
        <MenuItem value={periods.eightteen}>{periods.eightteen}</MenuItem>
      </Select>
      <div className={classes.calendarIcon}>
        <CalendarIcon />
      </div>
    </FormControl>
  );
}
