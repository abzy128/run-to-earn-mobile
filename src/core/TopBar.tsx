import { ThemeProp } from 'react-native-paper/lib/typescript/types';
import React from 'react';
import {Appbar} from 'react-native-paper';

function TopBar({theme}: {theme: ThemeProp}) {
  return (
    <Appbar.Header theme={theme}>
      <Appbar.Content title="RunToEarn" />
      <Appbar.Action icon="calendar" onPress={() => {}} />
    </Appbar.Header>
  );
}

export default TopBar;
