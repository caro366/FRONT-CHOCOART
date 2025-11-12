import * as React from 'react';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import App from './app';

export const temaAzul = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgb(0, 82, 183)',
    onPrimary: 'rgb(255, 255, 255)',
    primaryContainer: 'rgb(204, 224, 255)',
    onPrimaryContainer: 'rgb(0, 25, 61)',

    secondary: 'rgb(0, 96, 166)',
    onSecondary: 'rgb(255, 255, 255)',
    secondaryContainer: 'rgb(202, 229, 255)',
    onSecondaryContainer: 'rgb(0, 27, 56)',

    tertiary: 'rgb(0, 135, 174)',
    onTertiary: 'rgb(255, 255, 255)',
    tertiaryContainer: 'rgb(183, 238, 255)',
    onTertiaryContainer: 'rgb(0, 35, 45)',

    error: 'rgb(186, 26, 26)',
    onError: 'rgb(255, 255, 255)',
    errorContainer: 'rgb(255, 218, 214)',
    onErrorContainer: 'rgb(65, 0, 2)',

    background: 'rgb(245, 250, 255)',
    onBackground: 'rgb(20, 30, 40)',

    surface: 'rgb(245, 250, 255)',
    onSurface: 'rgb(20, 30, 40)',

    surfaceVariant: 'rgb(219, 230, 243)',
    onSurfaceVariant: 'rgb(60, 80, 100)',

    outline: 'rgb(100, 120, 140)',
    outlineVariant: 'rgb(180, 200, 220)',

    shadow: 'rgb(0, 0, 0)',
    scrim: 'rgb(0, 0, 0)',

    inverseSurface: 'rgb(40, 50, 60)',
    inverseOnSurface: 'rgb(230, 240, 250)',
    inversePrimary: 'rgb(150, 200, 255)',

    elevation: {
      level0: 'transparent',
      level1: 'rgb(235, 245, 255)',
      level2: 'rgb(225, 240, 255)',
      level3: 'rgb(215, 235, 255)',
      level4: 'rgb(205, 230, 255)',
      level5: 'rgb(195, 225, 255)',
    },

    surfaceDisabled: 'rgba(20, 30, 40, 0.12)',
    onSurfaceDisabled: 'rgba(20, 30, 40, 0.38)',
    backdrop: 'rgba(20, 40, 60, 0.4)',
  },
};

export default function Main() {
  return (
    <PaperProvider theme={temaAzul}>
      <App />
    </PaperProvider>
  );
}
