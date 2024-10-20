import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import RunningRoute from '../running/RunningRoute';
import MarketRoute from '../market/MarketRoute';
import ProfileRoute from '../profile/ProfileRoute';
import {ThemeProp} from 'react-native-paper/lib/typescript/types';
import MapRoute from '../map/MapRoute';

function Navigation({theme}: {theme: ThemeProp}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'running',
      title: 'Running',
      focusedIcon: 'run',
    },
    {
      key: 'map',
      title: 'Map',
      focusedIcon: 'map',
    },
    {key: 'market', title: 'Market', focusedIcon: 'shopping'},
    {key: 'profile', title: 'Profile', focusedIcon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    running: RunningRoute,
    map: MapRoute,
    market: MarketRoute,
    profile: ProfileRoute,
  });
  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
      theme={theme}
    />
  );
}

export default Navigation;
