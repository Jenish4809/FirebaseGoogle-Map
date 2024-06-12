import {Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserDetails({navigation}) {
  const [user, setUser] = React.useState({});
  useEffect(() => {
    AsyncStorage.getItem('user').then(value => {
      const user = JSON.parse(value);
      setUser(user);
    });
  }, []);

  const onPressNext = () => {
    navigation.navigate('Home');
  };
  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.main}>
        <Text style={styles.title}>UserDetails</Text>
        <View style={styles.innerview}>
          <Text style={styles.text}>Name: {user.name}</Text>
          <Text style={styles.text}>Email: {user.email}</Text>
          <Text style={styles.text}>Uid: {user.uid}</Text>
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
