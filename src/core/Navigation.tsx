import React from 'react';
import {BottomNavigation} from 'react-native-paper';
import MainRoute from '../main/Main';
import MarketRoute from '../market/MarketRoute';
import ProfileRoute from '../profile/ProfileRoute';
import {ThemeProp} from 'react-native-paper/lib/typescript/types';

function Navigation({theme}: {theme: ThemeProp}) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    {
      key: 'main',
      title: 'Running',
      focusedIcon: 'run',
    },
    {key: 'market', title: 'Market', focusedIcon: 'shopping'},
    {key: 'profile', title: 'Profile', focusedIcon: 'account'},
  ]);

  const renderScene = BottomNavigation.SceneMap({
    main: MainRoute,
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
