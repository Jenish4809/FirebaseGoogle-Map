import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth, {firebase} from '@react-native-firebase/auth';

export default function UserDetails({navigation}) {
  const [user, setUser] = React.useState({});
  const [email, setEmail] = React.useState();
  useEffect(() => {
    AsyncStorage.getItem('user').then(value => {
      const user = JSON.parse(value);
      setUser(user);
      setEmail(user.email);
    });
  }, []);

  const onPressEmailVerify = async () => {
    const res = await auth().currentUser.sendEmailVerification();
    Alert.alert('Email send Successfully');
  };

  const onPressNext = () => {
    navigation.navigate('DynamicLink');
  };
  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.main}>
        <Text style={styles.title}>UserDetails</Text>
        <View style={styles.innerview}>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Uid: {user.uid}</Text>
          <Button title="Email Verify" onPress={onPressEmailVerify} />
          <Button title="Next Page" onPress={onPressNext} />
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
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'black',
  },
  innerview: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    alignItems: 'center',
    gap: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
});
