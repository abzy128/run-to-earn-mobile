import {mdiCalendar} from '@mdi/js';
import {Theme} from '@react-navigation/native';
import React from 'react';
import {Appbar} from 'react-native-paper';

function TopBar({theme}: {theme: Theme}) {
  return (
    <Appbar.Header theme={theme}>
      <Appbar.Content title="RunToEarn" />
      <Appbar.Action icon={mdiCalendar} onPress={() => {}} />
    </Appbar.Header>
  );
}

export default TopBar;
