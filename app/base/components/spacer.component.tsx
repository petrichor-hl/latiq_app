import React from 'react';
import { StyleSheet, View } from 'react-native';

export const Spacer = () => {
  return <View style={styles.flex1} />;
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1,
  },
});
