import React from 'react';
import Animated, { LinearTransition } from 'react-native-reanimated';
import { zustandRoom } from '../../../zustand/room.zustand';
import { Text, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../../pick-avatar/pick-avatar.constants';
import { ColorPalette } from '../../../base/constants/color-palette';
import { zustandUser } from '../../../zustand/user.zustand';

export const RankingBoard = () => {
  const { usersInRoom } = zustandRoom();
  const { user } = zustandUser.getState();

  const sortedUsers = [...usersInRoom].sort(
    (a, b) => b.userPoints - a.userPoints,
  );

  return (
    <Animated.FlatList
      data={sortedUsers}
      keyExtractor={item => item.userId}
      contentContainerStyle={{ padding: 6 }}
      itemLayoutAnimation={LinearTransition}
      style={{ maxWidth: 150 }}
      renderItem={({ item }) => {
        const [collectionNumber, seedNumber] = item.userAvatar
          .split('-')
          .map(e => Number(e));

        return (
          <View
            style={{
              flexDirection: 'row',
              padding: 6,
              backgroundColor:
                item.userId === user.id
                  ? ColorPalette.green[500]
                  : ColorPalette.primary,
              borderRadius: 6,
              marginBottom: 6,
              columnGap: 8,
            }}>
            <SvgXml
              xml={
                avatarCollectionsList[collectionNumber].avatarXml(40)[
                  seedNumber
                ]
              }
            />
            <View>
              <Text
                style={{
                  color: ColorPalette.black,
                }}>
                {item.userNickName}
              </Text>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: ColorPalette.black,
                }}>{`${item.userPoints} điểm`}</Text>
            </View>
          </View>
        );
      }}
    />
  );
};
