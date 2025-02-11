import React, { useState } from 'react';
import {
  ImageBackground,
  ListRenderItem,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ColorPalette } from '../../base/constants/color-palette';
import { goBack, push } from '../../navigation/navation.config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { PhysicalButton } from '../../base/components/physical-button.component';
import { useDidMount, useWillUnmount } from 'rooks';
import { Room } from '../make-room/make-room.type';
import { RoomService } from '../../services/features/room.services';
import FastImage from 'react-native-fast-image';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { hideLoading, showLoading } from '../../zustand/loading.zustand';
import {
  WaitingRoomScreen,
  WaitingRoomScreenProps,
} from '../waiting-room/waiting-room.screen';
import { zustandRoom } from '../../zustand/room.zustand';
import { playSound } from '../../base/helpers/sound.helper';
import { EnumSoundName } from '../../base/constants/sound-name';
import { zustandSignalR } from '../../zustand/signal-r.zustand';
import Animated, { LinearTransition } from 'react-native-reanimated';
import {
  MakeRoomScreen,
  MakeRoomScreenProps,
} from '../make-room/make-room.screen';

export interface PublicRoomListScreenProps {}

export const PublicRoomListScreen = (_props: PublicRoomListScreenProps) => {
  const { setRoomInfo } = zustandRoom.getState();
  const { connection } = zustandSignalR.getState();

  const insets = useSafeAreaInsets();

  const [rooms, setRooms] = useState<Room[]>([]);

  useDidMount(async () => {
    const fetchedRooms = await RoomService.getPublicRoomList();
    setRooms(fetchedRooms);

    connection?.on('NewPublicRoomCreated', (newRoomCreated: Room) => {
      setRooms(prevRooms => [newRoomCreated, ...prevRooms]);
    });

    connection?.on('DeletePublicRoom', (roomId: string) => {
      setRooms(prevRooms => prevRooms.filter(room => room.roomId !== roomId));
    });
  });

  useWillUnmount(() => {
    connection?.off('NewPublicRoomCreated');
    connection?.off('DeletePublicRoom');
  });

  const handlePressRoomItem = async (code: string) => {
    playSound(EnumSoundName.ButtonClick);

    showLoading();
    try {
      const roomInfo = await RoomService.getRoomInfo(code, false);
      setRoomInfo(roomInfo);
      setTimeout(async () => {
        hideLoading();
        push<WaitingRoomScreenProps>(WaitingRoomScreen);
      }, 500);
    } catch (error) {
      hideLoading();
    }
  };

  const renderItem: ListRenderItem<Room> = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => handlePressRoomItem(item.roomId)}
        style={{ flexDirection: 'row', columnGap: 16, alignItems: 'center' }}>
        <FastImage
          source={{ uri: item.topic.imageUrl }}
          style={styles.topicImage}
          resizeMode="cover"
        />

        <View style={{ flex: 1, rowGap: 2 }}>
          <Text style={styles.titleTxt}>{`#${item.roomId}`}</Text>
          <Text style={styles.titleTxt}>{`Chủ đề: ${item.topic.name}`}</Text>
        </View>

        <View style={{ rowGap: 2, alignItems: 'center' }}>
          <FontAwesome6 name="trophy" size={28} color={ColorPalette.primary} />
          <Text style={styles.titleTxt}>{`${item.points} pts`}</Text>
        </View>

        <MaterialIcons name="arrow-forward-ios" />
      </TouchableOpacity>
    );
  };

  const separator = () => {
    return <View style={styles.separatorStyle} />;
  };

  const emptyList = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          rowGap: 12,
        }}>
        <Text style={styles.emptyRoomTxt}>{'Hiện chưa có sẵn phòng\n...'}</Text>
        <PhysicalButton
          paddingVertical={0}
          onPress={() => push<MakeRoomScreenProps>(MakeRoomScreen)}>
          <Text style={styles.btnTitle}>TẠO PHÒNG</Text>
        </PhysicalButton>
      </View>
    );
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-0.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.headerRow}>
        <PhysicalButton
          paddingVertical={0}
          paddingHorizontal={0}
          width={64}
          onPress={goBack}>
          <Ionicons name={'arrow-undo'} size={28} color={ColorPalette.white} />
        </PhysicalButton>

        <Text style={styles.sreenTitle}>Danh sách phòng sẵn có</Text>

        <View style={{ width: 64 }} />
      </View>

      <Animated.FlatList
        itemLayoutAnimation={LinearTransition}
        style={[
          styles.flatListContentCtn,
          { marginBottom: Math.max(insets.bottom, 20) },
        ]}
        contentContainerStyle={{ flex: 1, padding: 20 }}
        data={rooms}
        keyExtractor={item => item.roomId}
        renderItem={renderItem}
        ItemSeparatorComponent={separator}
        ListEmptyComponent={emptyList}
      />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: WIDTH,
    height: HEIGHT,
    rowGap: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    columnGap: 20,
  },
  sreenTitle: {
    flex: 1,
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  flatListContentCtn: {
    marginHorizontal: 20,

    backgroundColor: ColorPalette.white,
    borderRadius: 15,
  },
  topicImage: {
    height: 60,
    width: 60,
    borderRadius: 6,
  },
  titleTxt: {
    color: ColorPalette.gray[400],
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyRoomTxt: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: ColorPalette.gray[400],
  },
  separatorStyle: {
    height: 2,
    backgroundColor: ColorPalette.gray[200],
    marginVertical: 10,
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.white,
  },
});
