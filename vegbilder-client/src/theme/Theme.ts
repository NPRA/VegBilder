import { createMuiTheme } from '@material-ui/core/styles';
import LFTEticaThinWoff from 'fonts/LFTEticaLt.woff';
import LFTEticalRegularWoff from 'fonts/LFT_Etica_Reg.woff';
import LFTEticaSemiBoldWoff from 'fonts/LFT_Etica_Semibold.woff';

declare module '@material-ui/core/styles/createPalette' {
  interface CommonColors {
    grayDark: string;
    grayDarker: string;
    grayRegular: string;
    grayMedium: string;
    grayIcons: string;
    grayMenuItems: string;
    charcoalLighter: string;
    orangeDark: string;
  }
}

const grayRegular = '#ececec';
const grayIcons = '#c4c4c4';
const charcoalLighter = '#646A70';
const grayDark = '#444F55';
const grayDarker = '#2E3539';
const orangeDark = '#F67F00';
const blueRegular = '#077197';
const grayMenuItems = '#c4c4c4';
const grayMedium = '#45515A';

const LFTEticaThin = {
  fontFamily: '"LFT-Etica thin"',
  fontStyle: 'thin',
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
  fontWeight: 600,
  src: `
    local('LFT-Etica'),
    local('LFT_Etica_Semibold'),
    url(${LFTEticaSemiBoldWoff}) format('woff')
  `,
  unicodeRange:
    'U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF',
};

export const MEDIA_QUERIES = {
  mobile: '@media (max-width: 760px)',
  portrait: '@media (orientation: portrait)',
  landspace: '@media (orientation: landscape)',
};

export default createMuiTheme({
  typography: {
    fontFamily: ['"LFT-Etica"', 'sans-serif'].join(','),
    h1: {
      fontFamily: '"LFT-Etica thin"',
    },
    h2: {
      fontFamily: '"LFT-Etica thin"',
    },
    h3: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '1.125rem',
    },
    h4: {
      fontSize: '1.725rem',
    },
    h5: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '0.9375rem',
    },
    h6: {
      fontFamily: '"LFT-Etica thin"',
      fontSize: '0.875rem',
    },
    subtitle1: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '0.875rem',
    },
    subtitle2: {
      fontFamily: '"LFT-Etica semi-bold"',
      fontSize: '0.775rem',
    },
    body1: {
      fontSize: '0.875rem',
    },
  },
  palette: {
    common: {
      grayDark: grayDark,
      grayDarker: grayDarker,
      grayRegular: grayRegular,
      grayIcons: grayIcons,
      grayMenuItems: grayMenuItems,
      charcoalLighter: charcoalLighter,
      orangeDark: orangeDark,
      grayMedium: grayMedium,
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
      main: blueRegular,
    },
  },
  shape: {
    borderRadius: 8,
  },
  overrides: {
    MuiCssBaseline: {
      // globally define custom fonts
      '@global': {
        '@font-face': [LFTEticaRegular, LFTEticaSemiBold, LFTEticaThin],
      },
    },
    // Styles for Select menu
    MuiMenu: {
      // <ul> element
      list: {
        fontFamily: '"LFT-Etica"',
        backgroundColor: grayDarker,
        color: grayMenuItems,
        boxShadow: '2px 7px 7px rgba(0, 0, 0, 0.35)',
        borderRadius: '10px',
      },
    },
    MuiButton: {
      root: {
        fontFamily: '"LFT-Etica semi-bold"',
        borderStyle: 'none',
        color: grayRegular,
        fontSize: '0.725rem',
        padding: 0,
        '&:hover': {
          color: orangeDark,
        },
      },
    },
    MuiIconButton: {
      root: {
        fontFamily: '"LFT-Etica"',
        borderRadius: '0.625rem',
        borderStyle: 'none',
        backgroundColor: grayDark,
        color: grayIcons,
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
        '&$selected': {
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
        fontFamily: '"LFT-Etica semi-bold"',
        color: grayMenuItems,
        textTransform: 'uppercase',
        margin: 0,
      },
      gutters: {
        paddingLeft: '1.875rem',
        paddingRight: '1.875rem',
      },
    },
    MuiPaper: {
      root: {
        fontFamily: '"LFT-Etica"',
        backgroundColor: grayDark,
        color: grayMenuItems,
      },
    },
    MuiPopover: {
      paper: {
        fontFamily: '"LFT-Etica"',
        backgroundColor: grayDarker,
        color: grayMenuItems,
      },
    },
    MuiTooltip: {
      tooltip: {
        fontFamily: '"LFT-Etica"',
        backgroundColor: grayDark,
        color: grayMenuItems,
        fontSize: '0.875rem',
        padding: '0.5rem',
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: grayMenuItems,
        heigth: '0.5px',
        marginBottom: '1rem',
      },
    },
    MuiLink: {
      root: {
        fontFamily: '"LFT-Etica"',
        color: grayMenuItems,
        '&:hover': {
          color: orangeDark,
          backgroundColor: grayDarker,
        },
      },
    },
    MuiTableRow: {
     root: {
         '&:hover': {
           cursor: 'clicker',
           '& .MuiTableCell-body': {
             cursor: 'default',
             color: orangeDark
           }
         }
     } 
    }
  },
});
