import { createMuiTheme } from '@material-ui/core/styles';
import LFTEthicalThin from 'fonts/LFTEticaLt.woff';

const grayRegular = '#ececec';
const grayIcons = '#c4c4c4';
const charcoalLighter = '#646A70';
const grayDark = '#444F55';
const grayDarker = '#2E3539';
const orangeDark = '#F67F00';
const blueRegular = '#077197';
const grayMenuItems = '#c4c4c4';

export default createMuiTheme({
  typography: {
    fontFamily: ['sans-serif', '"LFT-Etica"', '"Lucida Sans Unicode"', '"Lucida Grande"'].join(','),
  },
  palette: {
    common: {
      grayDark: grayDark,
      grayDarker: grayDarker,
      grayIcons: grayIcons,
      grayMenuItems: grayMenuItems,
      charcoalLighter: charcoalLighter,
      orangeDark: orangeDark,
    },
    primary: {
      main: grayDarker,
      contrastText: grayRegular,
    },
    secondary: {
      main: charcoalLighter,
      contrastText: grayRegular,
    },
    series: {
      main: grayDark,
      contrastText: grayMenuItems,
    },
    info: {
      main: blueRegular,
    },
  },
  shape: {
    borderRadius: '0.5rem',
  },
  overrides: {
    // Styles for Select menu
    MuiMenu: {
      // <ul> element
      list: {
        backgroundColor: grayDarker,
        color: grayMenuItems,
        border: `1px solid ${grayDark}`,
      },
    },
    MuiIconButton: {
      root: {
        borderRadius: '0.625rem',
        borderStyle: 'none',
        backgroundColor: grayDark,
        color: grayIcons,
        fontSize: '1.8rem',
        width: '2.3125rem',
        height: '2.1875rem',
        padding: '0',
        '&:hover': {
          color: orangeDark,
          backgroundColor: grayDark,
          '& span': {
            '& svg': {
              '& path': {
                fill: orangeDark,
              },
            },
          },
        },
      },
      label: {
        '& svg': {
          '& path': {
            fill: grayIcons,
          },
        },
      },
    },
    MuiListItemIcon: {
      root: {
        color: grayRegular,
      },
    },
    MuiListItem: {
      root: {
        color: grayMenuItems,
        '&:hover': {
          backgroundColor: grayDark,
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: orangeDark,
          },
        },
      },
    },
    MuiListItemText: {
      secondary: { color: grayMenuItems },
    },
    MuiListSubheader: {
      root: {
        color: grayMenuItems,
        textTransform: 'uppercase',
        margin: 0,
        fontWeight: 700,
      },
      gutters: {
        paddingLeft: '1.875rem',
        paddingRight: '1.875rem',
      },
    },
  },
});
