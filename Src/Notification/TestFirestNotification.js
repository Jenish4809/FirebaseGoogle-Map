// import {StyleSheet, Text, View} from 'react-native';
// import React from 'react';
// import CSafeAreaView from '../Common/CSafeAreaView';

// export default function TestFirestNotification() {
//   return (
//     <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
//       <View style={styles.main}>
//         <Text>TestFirestNotification</Text>
//       </View>
//     </CSafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   main: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

import {
  Alert,
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import auth, {firebase} from '@react-native-firebase/auth';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';

export default function TestFirestNotification({navigation}) {
  const [name, setName] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userData, setUserData] = React.useState({});

  const onGoogleButtonPress = async () => {
    try {
      // Attempt Google sign-in
      const {idToken, user} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      navigation.navigate('Map', {
        user,
      });
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // Handle the user canceling the sign-in request
        Alert.alert('Sign-In Cancelled', 'You cancelled the sign-in request.');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // Operation (e.g. sign in) is in progress already
        Alert.alert(
          'Sign-In In Progress',
          'A sign-in operation is already in progress.',
        );
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // Play services not available or outdated
        Alert.alert(
          'Play Services Not Available',
          'Google Play Services is not available or outdated.',
        );
      } else {
        // Some other error
        Alert.alert('Sign-In Error', error.message);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        '453801850363-a9ums70ued30rbqnjkoknjvitdej2dnv.apps.googleusercontent.com',
    });
  }, []);

  const onChangeName = text => {
    setName(text);
  };
  const onChangePassword = text => {
    setPassword(text);
  };

  const onPressRegister = async () => {
    try {
      const response = await firebase
        .auth()
        .createUserWithEmailAndPassword(name, password);
      if (response) {
        Alert.alert('User Registered Successfully');
        setName('');
        setPassword('');
      }
    } catch (error) {
      console.log('Error in onPressRegister', error);
      Alert.alert('User already Exist');
    }
  };

  const onPressLogin = async () => {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(name, password);
      if (response) {
        Alert.alert('User Logged In Successfully');
        navigation.navigate('Map', {
          user: response.user,
        });
      }
    } catch (error) {
      console.log('Error in onPressLogin', error);
      Alert.alert('User not found');
    }
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user) {
        setUserData(user); // Set user state if logged in
      } else {
        setUserData(null); // Clear user state if logged out
        // setUserInfo({});
      }
    });

    return () => unsubscribe(); // Clean up subscription
  }, []);

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.container}>
        <Text style={styles.title}>Test Notification</Text>
        <View style={styles.main}>
          <TextInput
            placeholder="Enter Email"
            style={styles.inputsty}
            value={name}
            onChangeText={onChangeName}
            placeholderTextColor={'gray'}
          />
          <TextInput
            placeholder="Enter Password"
            style={styles.inputsty}
            value={password}
            onChangeText={onChangePassword}
            placeholderTextColor={'gray'}
          />
          <Button title="Register" onPress={onPressRegister} />
          <Button title="Login" onPress={onPressLogin} />
          <Button title="Google Sign In" onPress={onGoogleButtonPress} />
        </View>
      </View>
    </CSafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 20,
  },
  inputsty: {
    width: '80%',
    height: 50,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 8,
    padding: 10,
  },
});
