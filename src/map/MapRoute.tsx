import React from 'react';
import MapView, {Marker} from 'react-native-maps';
import {StyleSheet, View} from 'react-native';
import {GetCurrentLocation, MapPin} from './MapPins';
import {Avatar} from 'react-native-paper';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

function MapRoute() {
  const [startLocation, setStartLocation] = React.useState<MapPin | null>(null);
  const [currentLocation, setCurrentLocation] = React.useState<MapPin | null>(
    null,
  );
  const [endLocation, setEndLocation] = React.useState<MapPin | null>(null);

  React.useEffect(() => {
    const getCurrentLocation = () => {
      const location = GetCurrentLocation();
      setCurrentLocation(location);
    };
    getCurrentLocation();
    const intervalId = setInterval(getCurrentLocation, 5000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <View>
      {currentLocation != null && (
        <View style={styles.container}>
          <MapView
            provider="google"
            style={styles.map}
            region={{
              latitude: currentLocation.latitude,
              longitude: currentLocation.longitude,
              latitudeDelta: 0.015,
              longitudeDelta: 0.0121,
            }}>
            {startLocation != null && (
              <Marker
                coordinate={{
                  latitude: startLocation.latitude,
                  longitude: startLocation.longitude,
                }}>
                <Avatar.Icon icon="map-marker" size={32} color="blue" />
              </Marker>
            )}
            {currentLocation != null && (
              <Marker
                coordinate={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                }}>
                <Avatar.Icon icon="walk" size={32} color="red" />
              </Marker>
            )}
            {endLocation != null && (
              <Marker
                coordinate={{
                  latitude: endLocation.latitude,
                  longitude: endLocation.longitude,
                }}>
                <Avatar.Icon icon="map-marker" size={32} color="green" />
              </Marker>
            )}
          </MapView>
        </View>
      )}
    </View>
  );
}

export default MapRoute;
