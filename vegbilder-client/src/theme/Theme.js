import { createMuiTheme } from '@material-ui/core/styles';

const grayRegular = '#ececec';
const grayIcons = '#c4c4c4';
const charcoalLighter = '#646A70';
const grayDark = '#444F55';
const grayDarker = '#2E3539';
const orangeDark = '#F67F00';
const blueRegular = '#077197';

export default createMuiTheme({
  palette: {
    common: {
      grayDark: grayDark,
      grayDarker: grayDarker,
      grayIcons: grayIcons,
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
    info: {
      main: blueRegular,
    },
  },
  shape: {
    borderRadius: '0.5rem',
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
        color: grayIcons,
        '&:hover': {
          backgroundColor: grayDark,
          '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
            color: orangeDark,
          },
        },
      },
    },
  },
});
