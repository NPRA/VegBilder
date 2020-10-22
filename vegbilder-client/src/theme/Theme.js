import { createMuiTheme } from "@material-ui/core/styles";

const gray = "#c4c4c4";
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
      contrastText: gray,
    },
    secondary: {
      main: grayDark,
      contrastText: gray,
    },
    info: {
      main: orangeDark,
    },
  },
});
