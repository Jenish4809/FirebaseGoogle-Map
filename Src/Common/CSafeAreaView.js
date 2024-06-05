import {StyleSheet} from 'react-native';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

export default function CSafeAreaView({children, extraStyle, ...props}) {
  return (
    <SafeAreaView {...props} style={[localStyles.root, extraStyle]}>
      {children}
    </SafeAreaView>
  );
}

const localStyles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
