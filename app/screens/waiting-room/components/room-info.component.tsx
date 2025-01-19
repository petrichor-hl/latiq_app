import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ColorPalette } from '../../../base/constants/color-palette';

interface RoomInfoProps {
  topicName: string;
  points: number;
}

export const RoomInfo = (props: RoomInfoProps) => {
  const { topicName, points } = props;

  return (
    <View style={styles.container}>
      <Text style={styles.infoTxt}>{`Chủ đề: ${topicName}`}</Text>
      <Text style={styles.infoTxt}>{`Points: ${points}`}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0009',
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  infoTxt: {
    color: ColorPalette.white,
    fontSize: 16,
    fontWeight: '500',
  },
});
