import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputBase } from "@material-ui/core";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { CalendarIcon } from "../Icons/Icons";
import { useYearFilter, years } from "../../contexts/YearFilterContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";
import { useImageSeries } from "../../contexts/ImageSeriesContext";

const CustomInput = withStyles((theme) => ({
  input: {
    paddingTop: "0.8125rem",
    paddingBottom: "0.8125rem",
    paddingLeft: "2.3125rem",
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  yearSelect: {
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

export default function YearSelector() {
  const classes = useStyles();
  const { year, setYear } = useYearFilter();
  const { setCurrentImagePoint } = useCurrentImagePoint();
  const {
    setCurrentImageSeriesRoadContext,
    setAvailableImageSeries,
    setCurrentImageSeries,
  } = useImageSeries();

  return (
    <FormControl>
      <Select
        id="year-select"
        value={year}
        onChange={(event) => {
          setYear(event.target.value);
          setCurrentImageSeriesRoadContext(null);
          setAvailableImageSeries([]);
          setCurrentImageSeries(null);
          setCurrentImagePoint(null);
        }}
        className={classes.yearSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
      >
        {years.map((tp) => (
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
