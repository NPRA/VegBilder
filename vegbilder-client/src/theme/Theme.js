import { createMuiTheme } from '@material-ui/core/styles';
import LFTEticaThinWoff from 'fonts/LFTEticaLt.woff';
import LFTEticalRegularWoff from 'fonts/LFT_Etica_Reg.woff';
import LFTEticaSemiBoldWoff from 'fonts/LFT_Etica_Semibold.woff';

const grayRegular = '#ececec';
const grayIcons = '#c4c4c4';
const charcoalLighter = '#646A70';
const grayDark = '#444F55';
const grayDarker = '#2E3539';
const orangeDark = '#F67F00';
const blueRegular = '#077197';
const grayMenuItems = '#c4c4c4';

const LFTEticaThin = {
  fontFamily: '"LFT-Etica"',
  fontStyle: 'thin',
  fontDisplay: 'swap',
  fontWeight: 200,
  lineHeight: 1.4,
  src: `
    local('LFT-Etica'),
    local('LFTEticaLt'),
    url(${LFTEticaThinWoff}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const LFTEticaRegular = {
  fontFamily: '"LFT-Etica"',
  fontStyle: 'regular',
  fontDisplay: 'swap',
  fontWeight: 400,
  lineHeight: 1.4,
  src: `
    local('LFT-Etica'),
    local('LFT_Etica_Reg'),
    url(${LFTEticalRegularWoff}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

const LFTEticaSemiBold = {
  fontFamily: '"LFT-Etica semi-bold"',
  fontStyle: 'semi-bold',
  lineHeight: 1.4,
  fontDisplay: 'swap',
  fontWeight: 600,
  src: `
    local('LFT-Etica'),
    local('LFT_Etica_Semibold'),
    url(${LFTEticaSemiBoldWoff}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export default createMuiTheme({
  typography: {
    fontFamily: ['sans-serif', '"LFT-Etica"'].join(','),
    h3: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '1.125rem',
    },
    subtitle1: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '0.875rem',
    },
    body1: {
      fontFamily: '"LFT-Etica"',
      fontSize: '0.875rem',
    },
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
    MuiCssBaseline: {
      // globally define custom fonts
      '@global': {
        '@font-face': [LFTEticaRegular, LFTEticaSemiBold],
      },
    },
    // Styles for Select menu
    MuiMenu: {
      // <ul> element
      list: {
        fontFamily: '"LFT-Etica"',
        backgroundColor: grayDarker,
        color: grayMenuItems,
        border: `1px solid ${grayDark}`,
      },
    },
    MuiIconButton: {
      root: {
        fontFamily: '"LFT-Etica"',
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
        fontFamily: '"LFT-Etica"',
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
      secondary: { color: grayMenuItems, fontFamily: '"LFT-Etica"' },
    },
    MuiListSubheader: {
      root: {
        fontFamily: '"LFT-Etica"',
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
    MuiPaper: {
      root: {
        fontFamily: '"LFT-Etica"',
      },
    },
  },
});
