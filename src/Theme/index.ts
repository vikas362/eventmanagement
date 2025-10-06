import {StyleSheet, Dimensions, TouchableOpacity, Platform} from 'react-native';
import {createBox, createText, createTheme} from '@shopify/restyle';

import {scaledSize} from '../Helpers/responsive-ratio';
const {width, height} = Dimensions.get('window');

export const size = {
  //Primary
  width: width,
  height: height,
};
export const os = {
  ios: Platform.OS == 'ios',
};

export const palette = {
  //Primary
  primary: '#D71513',

  //Black Shade
  blackshade: '#1c1c1c',
  //Destructive
  destructive: '#EF4444',

  // Secondary
  secondary: '#CED4FD',

  //Tertiary
  tertiary: '#F4F5F7',

  //Supporting colos
  support: '#172B3D',

  // App colors
  transparent: '#00000060',
  black: 'rgb(26, 26, 26)',
  inputBorder: '#E5E5E5',
  placeholder: '#A3A3A3',
  white: '#ffffff',
  overlay: 'rgba(0, 0, 0, 0.1)',
  border: 'rgba(0,0,0,.4)',
};

export const TypographyStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  cardShadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  singProductCard: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -3,
    },
    shadowOpacity: 0.48,
    shadowRadius: 8.95,

    elevation: 6,
  },
  card: {
    minHeight: 175,
    backgroundColor: 'white',
    borderRadius: 25,
    marginHorizontal: 30,
  },
});
//   export const fonts = {
//     bold: 'Poppins-Bold',
//     semibold: 'Poppins-SemiBold',
//     medium: 'Poppins-Medium',
//     light: 'Poppins-Light',
//     thin: 'Poppins-Thin',
//     thinitalic: 'Poppins-ThinItalic',
//     mediumItalic: 'Poppins-MediumItalic',
//     regular: 'Poppins-Regular',
//     italicLight: 'Poppins-LightItalic',
//     italicBlack: 'Poppins-BlackItalic',
//     boldItalic: 'Poppins-BoldItalic',
//     italic: 'Poppins-Italic',
//     black: 'Poppins-Black',
//   };

const theme = createTheme({
  colors: {
    white: 'white',
    black: 'black',
    red: 'red',
    //Primary
    primary: palette?.primary,

    // Black shade
    blackshade: palette?.blackshade,

    //Destructive
    destructive: palette.destructive,

    // Secondary
    secondary: palette.secondary,

    //placeholder
    placeholder: palette.placeholder,

    //Tertiary
    tertiary: palette.tertiary,

    border: palette?.border,
    inputBorder: palette?.inputBorder,
    //Supporting colos
    support: 'support',

    transparent: palette.transparent,
  },
  spacing: {
    xs: 1,
    vs: 3,
    s: 5,
    sm: 7,
    m: 10,
    mt: 12,
    t: 15,
    ml: 16,
    l: 20,
    xl: 25,
    xxl: 50,
  },
  breakpoints: {
    phone: 0,
    tablet: 768,
  },
  textVariants: {
    defaults: {
      fontSize: scaledSize(20),
      fontWeight: '600',
      color: 'black',
    },
    Black20Regular: {
      fontSize: scaledSize(20),
      fontWeight: '600',
      color: 'black',
    },
    Black12Regular: {
      fontSize: scaledSize(12),
      fontWeight: '400',
      color: 'placeholder',
    },
  },
});

export const Text = createText();
export const Box = createBox();
export const TouchableBox = createBox(TouchableOpacity);
// export const darkTheme = useColorScheme();

export type Theme = typeof theme;
export default theme;
