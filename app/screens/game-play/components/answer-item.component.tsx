import React from 'react';
import { IAnswerItem } from '../controllers/answer.controller';
import { StyleSheet, Text, View } from 'react-native';
import { ColorPalette } from '../../../base/constants/color-palette';
import Entypo from 'react-native-vector-icons/Entypo';

interface AnswerItemProps {
  answerItem: IAnswerItem;
}

export const AnswerItem = (props: AnswerItemProps) => {
  const { answerItem } = props;
  return (
    <View style={styles.container}>
      {answerItem.isCorrect && (
        <Entypo name="check" color={ColorPalette.green[400]} />
      )}
      <Text
        style={{
          fontSize: 18,
          color: answerItem.isCorrect
            ? ColorPalette.green[400]
            : ColorPalette.gray[300],
        }}>
        <Text
          style={{
            fontWeight: '500',
            color: answerItem.isCorrect
              ? ColorPalette.green[400]
              : ColorPalette.white,
          }}>
          {`${answerItem.userNickName}: `}
        </Text>
        {answerItem.content}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
});
