import * as React from 'react';
import {AppRegistry} from 'react-native';
import {MD3DarkTheme as DefaultTheme} from 'react-native-paper';
import {name as appName} from './app.json';
import {SafeAreaProvider} from 'react-native-safe-area-context';
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
    <SafeAreaProvider>
      <TopBar theme={theme} />
      <Navigation theme={theme} />
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(appName, () => Main);
