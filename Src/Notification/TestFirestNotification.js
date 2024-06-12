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
import firestore from '@react-native-firebase/firestore';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TestFirestNotification({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [userData, setUserData] = React.useState({});
  const [confirm, setConfirm] = React.useState(null);
  const [code, setCode] = React.useState('');

  async function signInWithPhoneNumber(phoneNumber) {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    Alert.alert('Code sent');
    setConfirm(confirmation);
  }

  async function confirmCode() {
    try {
      await confirm.confirm(code);
      Alert.alert('Code confirmed');
      navigation.navigate('Map');
    } catch (error) {
      Alert.alert('Invalid code.');
    }
  }

  const onGoogleButtonPress = async () => {
    try {
      // Attempt Google sign-in
      const {idToken, user} = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      await auth().signInWithCredential(googleCredential);
      if (user) {
        const UserDetail = {
          name: user.name,
          email: user.email,
          uid: user.id,
        };
        await firestore().collection('Users').doc(user.id).set(UserDetail);
        await AsyncStorage.setItem('user', JSON.stringify(UserDetail));
        navigation.navigate('UserDetails');
        Alert.alert('User Logged In Successfully');
      }
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
    setEmail(text);
  };
  const onChangePassword = text => {
    setPassword(text);
  };

  const onPressRegister = async () => {
    navigation.navigate('RegisterUser');
  };

  const onPressForgotPassword = async () => {
    await auth().sendPasswordResetEmail(email);
    Alert.alert('Reset Link send successfully');
  };

  const onPressLogin = async () => {
    try {
      const response = await firebase
        .auth()
        .signInWithEmailAndPassword(email, password);
      if (response) {
        await firestore()
          .collection('Users')
          .where('uid', '==', response.user.uid)
          .get()
          .then(querySnapshot => {
            querySnapshot.forEach(doc => {
              AsyncStorage.setItem('user', JSON.stringify(doc.data()));
            });
          });
        Alert.alert('User Logged In Successfully');
        navigation.navigate('UserDetails');
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
            value={email}
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
          <TextInput
            placeholder="Enter Code"
            style={styles.inputsty}
            value={code}
            onChangeText={text => setCode(text)}
            placeholderTextColor={'gray'}
          />
          <Button
            title="Send Code"
            onPress={() => signInWithPhoneNumber('+91 7265079268')}
          />
          <Button title="Register" onPress={onPressRegister} />
          <Button title="Login" onPress={onPressLogin} />
          <Button title="Google Sign In" onPress={onGoogleButtonPress} />
          <Button title="Confirm Code" onPress={() => confirmCode()} />
          <Button title="Forgot Password" onPress={onPressForgotPassword} />
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
