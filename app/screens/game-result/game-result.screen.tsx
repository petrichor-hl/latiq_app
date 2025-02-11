import React from 'react';
import {
  FlatList,
  ImageBackground,
  ListRenderItem,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { ColorPalette } from '../../base/constants/color-palette';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { reset } from '../../navigation/navation.config';
import { HomeScreen, HomeScreenProps } from '../home/home.screen';

import { zustandRoom } from '../../zustand/room.zustand';
import { TopicThree } from './components/top-three.component';
import { IUserInRoom } from '../waiting-room/waiting-room.type';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { PhysicalButton } from '../../base/components/physical-button.component';

export interface GameResultScreenProps {}

export const GameResultScreen = (_props: GameResultScreenProps) => {
  const insets = useSafeAreaInsets();

  const { usersInRoom } = zustandRoom.getState();

  const sortedUsersByPoint = [...usersInRoom].sort(
    (a, b) => b.userPoints - a.userPoints,
  );

  const renderItem: ListRenderItem<IUserInRoom> = ({ item, index }) => {
    const [collectionNumber, seedNumber] = item.userAvatar
      .split('-')
      .map(e => Number(e));

    return (
      <View
        style={{
          flexDirection: 'row',
          columnGap: 16,
          alignItems: 'center',
        }}>
        <View
          style={{
            borderColor: ColorPalette.primary,
            borderWidth: 2,
            borderRadius: 12,
            overflow: 'hidden',
          }}>
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(60)[seedNumber]
            }
          />
        </View>

        <View style={{ flex: 1, rowGap: 2 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 18 }}>
            {item.userNickName}
          </Text>

          <Text style={{ color: ColorPalette.gray[400] }}>
            {`${item.userPoints} điểm`}
          </Text>
        </View>
        <Text style={styles.ordinalNumber}>{`#${index + 4}`}</Text>
      </View>
    );
  };

  const separator = () => {
    return <View style={styles.separatorStyle} />;
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top + 15 }]}>
      <TopicThree />

      <View
        style={[
          styles.bottomModal,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <FlatList
          style={styles.flatListStyle}
          data={sortedUsersByPoint.slice(3)}
          keyExtractor={item => item.userId}
          renderItem={renderItem}
          ItemSeparatorComponent={separator}
        />
        <PhysicalButton
          paddingVertical={0}
          buttonColor={ColorPalette.primary}
          buttonBackgroundColor={ColorPalette.primaryActive}
          onPress={() => reset<HomeScreenProps>(HomeScreen)}>
          <Ionicons name="home" size={28} color={ColorPalette.white} />
        </PhysicalButton>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
  },
  separatorStyle: {
    height: 2,
    backgroundColor: ColorPalette.gray[200],
    marginVertical: 10,
  },
  bottomModal: {
    flex: 1,
    backgroundColor: '#fef8e9',
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    rowGap: 16,
  },
  flatListStyle: {
    flex: 1,
  },
  ordinalNumber: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    backgroundColor: ColorPalette.rose[600],
    color: ColorPalette.white,
    fontWeight: 'bold',
    fontSize: 18,
    borderRadius: 15,
    overflow: 'hidden',
  },
});
