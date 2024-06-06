import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';
import CSafeAreaView from '../Common/CSafeAreaView';
import {Google_Api} from './ApiMapKey';

export default function Map() {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const requestLocationPermission = async () => {
    let status;
    if (Platform.OS === 'ios') {
      status = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    } else if (Platform.OS === 'android') {
      status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }

    if (status !== RESULTS.GRANTED) {
      console.log('Location permission denied');
    }
  };

  // useEffect(() => {
  //   requestLocationPermission();
  // }, []);

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.container}>
        <GooglePlacesAutocomplete
          placeholder="Search"
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            if (details) {
              const {lat, lng} = details.geometry.location;
              setSelectedLocation({
                latitude: lat,
                longitude: lng,
                title: data.description,
                description: '',
              });
            }
          }}
          fetchDetails={true}
          query={{
            key: {Google_Api},
            language: 'en',
          }}
          styles={{
            container: styles.autocompleteContainer,
            textInputContainer: styles.textInputContainer,
            textInput: styles.textInput,
            predefinedPlacesDescription: styles.predefinedPlacesDescription,
          }}
        />
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          initialRegion={{
            latitude: 21.23359,
            longitude: 72.863472,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          region={
            selectedLocation
              ? {
                  latitude: selectedLocation.latitude,
                  longitude: selectedLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }
              : undefined
          }>
          {selectedLocation && (
            <Marker
              draggable={true}
              coordinate={{
                latitude: selectedLocation.latitude,
                longitude: selectedLocation.longitude,
              }}
              title={selectedLocation.title}
              description={selectedLocation.description}
              pinColor="red"
            />
          )}
        </MapView>
      </View>
    </CSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  autocompleteContainer: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  textInputContainer: {
    backgroundColor: 'rgba(0,0,0,0)',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  textInput: {
    height: 38,
    color: '#5d5d5d',
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  predefinedPlacesDescription: {
    color: '#1faadb',
  },
});
