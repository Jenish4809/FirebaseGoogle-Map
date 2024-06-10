import {
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import CSafeAreaView from '../Common/CSafeAreaView';
import {Google_Api} from './ApiMapKey';
import MapViewDirections from 'react-native-maps-directions';
import AntDesign from 'react-native-vector-icons/AntDesign';

export default function Map({navigation}) {
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedToLocation, setSelectedToLocation] = useState(null);

  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Need Location Permission',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('You can use the Location');
        } else {
          console.log('Location permission denied');
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const GoogleSearch = ({name, onPress, containerstyle, value, onclear}) => {
    return (
      <GooglePlacesAutocomplete
        onclear={onclear}
        textInputProps={{
          placeholderTextColor: 'black',
          value: value,
        }}
        clearButtonMode="always"
        placeholder={name}
        onPress={onPress}
        fetchDetails={true}
        query={{
          key: Google_Api,
          language: 'en',
        }}
        styles={{
          container: containerstyle,
          textInputContainer: styles.textInputContainer,
          textInput: styles.textInput,
          predefinedPlacesDescription: styles.predefinedPlacesDescription,
        }}
      />
    );
  };

  const CommonMarker = ({coordinate, title, description}) => {
    return (
      <Marker
        draggable={true}
        coordinate={coordinate}
        title={title}
        description={description}
        pinColor="red"
      />
    );
  };

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.container}>
        <View style={styles.innerView}>
          <AntDesign
            name="left"
            style={{
              fontSize: 30,
              color: 'black',
            }}
            onPress={() => {
              navigation.goBack();
            }}
          />
          <AntDesign
            name="arrowright"
            style={{
              fontSize: 30,
              color: 'black',
            }}
            onPress={() => {
              navigation.navigate('RegisterUser');
            }}
          />
        </View>
        <GoogleSearch
          value={selectedLocation?.title}
          name={'From'}
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
          containerstyle={styles.autocompleteContainer}
        />
        <GoogleSearch
          value={selectedToLocation?.title}
          name={'To'}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            if (details) {
              const {lat, lng} = details.geometry.location;
              setSelectedToLocation({
                latitude: lat,
                longitude: lng,
                title: data.description,
                description: '',
              });
            }
          }}
          containerstyle={styles.autocompleteContainer1}
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
          {selectedLocation && selectedToLocation && (
            <>
              <CommonMarker
                coordinate={{
                  latitude: selectedLocation?.latitude,
                  longitude: selectedLocation?.longitude,
                }}
                title={selectedLocation?.title}
                description={selectedLocation?.description}
              />
              <CommonMarker
                coordinate={{
                  latitude: selectedToLocation?.latitude,
                  longitude: selectedToLocation?.longitude,
                }}
                title={selectedToLocation?.title}
                description={selectedToLocation?.description}
              />
            </>
          )}

          <MapViewDirections
            origin={{
              latitude: selectedLocation?.latitude,
              longitude: selectedLocation?.longitude,
            }}
            destination={{
              latitude: selectedToLocation?.latitude,
              longitude: selectedToLocation?.longitude,
            }}
            apikey={Google_Api}
            strokeWidth={7}
            strokeColor="blue"
            // timePrecision="now"
          />
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
    top: 50,
    left: 10,
    right: 10,
    zIndex: 1,
  },
  autocompleteContainer1: {
    position: 'absolute',
    top: 95,
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
  innerView: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    flexDirection: 'row',
    width: '100%',
    padding: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
