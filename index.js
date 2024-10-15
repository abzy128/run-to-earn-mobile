import * as React from 'react';
import {AppRegistry} from 'react-native';
import {
  Button,
  MD3DarkTheme as DefaultTheme,
  PaperProvider,
} from 'react-native-paper';
import {name as appName} from './app.json';
import Navigation from './src/core/Navigation';
import TopBar from './src/core/TopBar';
import Icon from 'react-native-vector-icons/MaterialIcons';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'tomato',
    secondary: 'yellow',
  },
};

Icon.loadFont();

export default function Main() {
  return (
    <PaperProvider theme={theme}>
      <TopBar />
      <Navigation />
    </PaperProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
