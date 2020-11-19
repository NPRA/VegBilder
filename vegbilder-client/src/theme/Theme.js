import { createMuiTheme } from "@material-ui/core/styles";

const grayRegular = "#ececec";
const grayIcons = "#c4c4c4";
const charcoalLighter = "#646A70";
const grayDark = "#444F55";
const grayDarker = "#2E3539";
const orangeDark = "#F67F00";

export default createMuiTheme({
  palette: {
    common: {
      grayDark: grayDark,
      grayDarker: grayDarker,
      grayIcons: grayIcons,
      charcoalLighter: charcoalLighter,
    },
    primary: {
      main: grayDarker,
      contrastText: grayRegular,
    },
    secondary: {
      main: charcoalLighter,
      contrastText: grayRegular,
    },
    info: {
      main: orangeDark,
    },
  },
  shape: {
    borderRadius: "0.5rem",
  },
  overrides: {
    // Styles for Select menu: <ul> element
    MuiMenu: {
      list: {
        backgroundColor: grayDarker,
        color: grayRegular,
        border: `1px solid ${grayDark}`,
      },
    },
    // Styles for Select menu: <li> elements
    MuiMenuItem: {
      root: {},
    },
  },
});
