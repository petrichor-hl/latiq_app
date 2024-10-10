import React from 'react';
import { ActivityIndicator, StyleSheet } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { zustandLoading } from '../../zustand/loading.zustand';

export const GlobalLoading = () => {
  const { loading } = zustandLoading();

  if (!loading) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeIn}
      exiting={FadeOut}
      style={styles.loadingOverlay}>
      <ActivityIndicator color={'white'} size={'large'} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // StyleSheet.absoluteFill,
  loadingOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0005',
  },
});
