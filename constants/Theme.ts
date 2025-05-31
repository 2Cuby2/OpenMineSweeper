import { DefaultTheme } from '@react-navigation/native';

const Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#f9f7fa',
    primary: '#cfd1e0',
    primaryDark: '#6a7793',
    secondary: '#d0c9d0',
    secondaryDark: '#b4a8aa',
    text: 'dark',
    textLight: 'white',
  },
};

export default Theme;
