import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputBase } from "@material-ui/core";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { CalendarIcon } from "../Icons/Icons";
import { useTimePeriod, timePeriods } from "../../contexts/TimePeriodContext";

const CustomInput = withStyles((theme) => ({
  input: {
    paddingTop: "0.8125rem",
    paddingBottom: "0.8125rem",
    paddingLeft: "2.3125rem",
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  timePeriodSelect: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    color: theme.palette.secondary.contrastText,
    width: "8.5rem",
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
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
  const { timePeriod, setTimePeriod } = useTimePeriod();

  console.log(`Tidsperiode: ${timePeriod}`);

  return (
    <FormControl>
      <Select
        id="year-select"
        value={timePeriod}
        onChange={(event) => setTimePeriod(event.target.value)}
        className={classes.timePeriodSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
      >
        {timePeriods.map((tp) => (
          <MenuItem key={tp} value={tp}>
            {tp}
          </MenuItem>
        ))}
      </Select>
      <div className={classes.calendarIcon}>
        <CalendarIcon />
      </div>
    </FormControl>
  );
}
