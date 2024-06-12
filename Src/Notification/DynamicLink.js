import {Alert, Button, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Clipboard from '@react-native-clipboard/clipboard';

export default function DynamicLink({navigation}) {
  const [generalLink, setGeneralLink] = useState(null);

  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://github.com/',
      domainUriPrefix: 'https://firebasenotifee.page.link/6SuK',
    });
    setGeneralLink(link);
  };

  const handleDynamicLink = link => {
    console.log('link', link);
    if (link?.url === 'https://github.com/') {
      Alert.alert('If condition in foreground mode');
    } else {
      Alert.alert('Else Condition in foreground mode');
    }
  };

  useEffect(() => {
    const DynamicLinkVar = dynamicLinks().onLink(handleDynamicLink);
    return () => DynamicLinkVar();
  }, []);

  useEffect(() => {
    dynamicLinks()
      .getInitialLink()
      .then(link => {
        if (link?.url === 'https://github.com/') {
          Alert.alert('If condition in kill mode');
        } else {
          Alert.alert('Else Condition in kill mode');
        }
      });
  }, []);

  const openLink = () => {
    Clipboard.setString(generalLink);
  };

  const onpressNext = () => {
    navigation.navigate('ImageUpload');
  };

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.main}>
        <Text style={styles.title}>DynamicLink</Text>
        <View style={styles.innerview}>
          <Button title="Build Link" onPress={buildLink} />
          <Button title="Open Link" onPress={openLink} />
          <Button title="Next" onPress={onpressNext} />
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
    color: '#000000',
    fontWeight: 'bold',
  },
  innerview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
});
