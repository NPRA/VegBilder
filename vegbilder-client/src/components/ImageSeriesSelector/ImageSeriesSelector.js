import React from "react";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { InputBase } from "@material-ui/core";
import { fade, makeStyles, withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import { useImageSeries } from "../../contexts/ImageSeriesContext";
import { useCurrentImagePoint } from "../../contexts/CurrentImagePointContext";

const CustomInput = withStyles((theme) => ({
  input: {
    paddingTop: "0.8125rem",
    paddingBottom: "0.8125rem",
    paddingLeft: "0.8125rem",
  },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
  imageSeriesSelect: {
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.secondary.main, 0.8),
    color: theme.palette.secondary.contrastText,
    width: "8rem",
    "&:hover": {
      backgroundColor: fade(theme.palette.secondary.main, 1.0),
    },
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

export default function ImageSeriesSelector() {
  const classes = useStyles();
  const {
    availableImageSeries,
    currentImageSeries,
    setCurrentImageSeries,
  } = useImageSeries();
  const { setCurrentImagePoint } = useCurrentImagePoint();

  if (availableImageSeries.length <= 1) return null;
  return (
    <FormControl>
      <Select
        id="imageseries-select"
        value={currentImageSeries}
        onChange={(event) => {
          setCurrentImageSeries(event.target.value);
          setCurrentImagePoint(null);
        }}
        className={classes.imageSeriesSelect}
        input={<CustomInput />}
        IconComponent={CustomExpandMoreIcon}
      >
        {availableImageSeries.map((series) => (
          <MenuItem key={series} value={series}>
            {series}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
