

import * as React from 'react';
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import App from './src/App';

// const theme = {
//   ...DefaultTheme,
//   colors: yourGeneratedLightOrDarkScheme.colors, // Copy it from the color codes scheme and then use it here
// };

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      {/* <App /> */}

      xx
      
    </PaperProvider>
  );
}