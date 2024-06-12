import {Alert, Button, Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import CSafeAreaView from '../Common/CSafeAreaView';
import ImagePicker from 'react-native-image-crop-picker';
import storage from '@react-native-firebase/storage';

export default function ImageUpload() {
  const [image, setImage] = React.useState('');
  const pickImage = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      setImage(image.path);
    });
  };

  const uploadImage = async () => {
    if (image) {
      const reference = storage().ref('images/');
      await reference.putFile(image);
      const url = await reference.getDownloadURL();
      Alert.alert('Image uploaded successfully:', url);
    } else {
      console.log('Please select an image');
    }
  };

  return (
    <CSafeAreaView extraStyle={{backgroundColor: 'transparent'}}>
      <View style={styles.main}>
        <Text style={styles.title}>ImageUpload</Text>
        <View style={styles.innerview}>
          {image ? <Image source={{uri: image}} style={styles.img} /> : null}

          <Button title="Choose Image" onPress={pickImage} />
          <Button title="Upload Image" onPress={uploadImage} />
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
    color: 'black',
    fontWeight: 'bold',
  },
  innerview: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  img: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
  },
});
