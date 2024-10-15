import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ColorPalette } from '../base/constants/color-palette';

interface UpdateProgressProps {
  progress: number;
}

export const UpdateProgress = (props: UpdateProgressProps) => {
  const { progress } = props;

  return (
    <View style={styles.container}>
      <BlurView style={styles.blurView} />
      <Text style={styles.progressTxt}>{`Đã tải: ${progress}%`}</Text>
      <View style={styles.progressCtn}>
        <View style={[styles.progress, { width: `${progress}%` }]} />
      </View>
    </View>
  );
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    rowGap: 14,
  },
  blurView: {
    position: 'absolute',
    height: '100%',
    width: '100%',
  },
  progressTxt: {
    fontSize: 18,
    fontWeight: '500',
    color: ColorPalette.white,
  },
  progressCtn: {
    alignSelf: 'stretch',
    borderWidth: 2,
    borderRadius: 11,
    borderColor: ColorPalette.white,
    marginHorizontal: 20,
    padding: 2,
  },
  progress: {
    backgroundColor: ColorPalette.white,
    height: 14,
    borderRadius: 7,
  },
});
