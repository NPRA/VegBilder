import { createMuiTheme } from "@material-ui/core/styles";

const grayRegular = "#ececec";
const gray = "#c4c4c4";
const charcoalLighter = "#646A70";
const grayDark = "#444F55";
const grayDarker = "#2E3539";
const orangeDark = "#F67F00";

export default createMuiTheme({
  palette: {
    common: {
      grayDark: grayDark,
      grayDarker: grayDarker,
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
});
