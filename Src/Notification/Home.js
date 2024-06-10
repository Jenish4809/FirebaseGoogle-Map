import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import {firebase} from '@react-native-firebase/auth';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

export default function Home({route, navigation}) {
  // let {user} = route.params;

  // const [userInfo, setUserInfo] = React.useState(user);

  const onPressLogout = async () => {
    try {
      await GoogleSignin.signOut();
      await firebase.auth().signOut();
      navigation.navigate('TestFirestNotification');
      // setUserInfo(null);
      Alert.alert('User Logged Out Successfully');
    } catch (error) {
      console.log('Error in onPressLogout', error);
      Alert.alert('User not found');
    }
  };

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.main}>
        <Text style={styles.text}>Loged in User</Text>
        <View style={styles.innerview}>
          <Button title="Logout" onPress={onPressLogout} />
        </View>
      </View>
    </CSafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    marginVertical: 10,
  },
  innerview: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  text2: {
    fontSize: 20,
    fontWeight: 'light',
    color: 'black',
  },
});
