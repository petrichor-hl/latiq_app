import React, { useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  ImageBackground,
  ListRenderItem,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// import { MediaStream, RTCView } from 'react-native-webrtc';

// import { BottomMedia } from './components/bottom-media.component';
import { RoomInfo } from './components/room-info.component';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { useWaitingRoomSignalR } from './controllers/signal-r.controller';
import { ColorPalette } from '../../base/constants/color-palette';
import { PhysicalButton } from '../../base/components/physical-button.component';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { goBack } from '../../navigation/navation.config';
import { zustandSignalR } from '../../zustand/signal-r.zustand';
import Clipboard from '@react-native-clipboard/clipboard';
import { showMessage } from 'react-native-flash-message';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Friend } from '../friend-list/friend-list.type';
import { UserService } from '../../services/features/user.services';
// import { useWaitingRoomMediaSoup } from './controllers/mediasoup.controller';
// import { CameraStatus } from './waiting-room.type';

export interface WaitingRoomScreenProps {}

const VIDEO_WINDOW_SIZE = (WIDTH - 20 * 2 - 10) / 2;

export const WaitingRoomScreen = (_props: WaitingRoomScreenProps) => {
  const insets = useSafeAreaInsets();

  // const {
  //   values: { localStream, localVideoConsumers },
  //   actions: { getLocalSteam },
  // } = useWaitingRoomMediaSoup({ roomCode: roomInfo.roomId });

  const {
    values: { isRoomOwner, roomInfo, usersInRoom },
    actions: { handleStartGame },
  } = useWaitingRoomSignalR({
    // getLocalSteam,
  });

  const { connection } = zustandSignalR.getState();

  const [modalVisible, setModalVisible] = useState(false);
  const [onlineFriends, setOnlineFriends] = useState<Friend[]>();

  const copyToClipboard = () => {
    Clipboard.setString(roomInfo.roomId);
    showMessage({
      message: 'Đã sao chép Mã phòng',
      position: 'top',
      statusBarHeight: insets.top,
      duration: 2000,
      backgroundColor: ColorPalette.primary,
      style: { alignItems: 'center' },
      titleStyle: { fontSize: 16 },
    });
  };

  const handleShowInviteFriendModal = async () => {
    setModalVisible(true);
    const fetchedOnlineFriends = await UserService.getOnlineFriends(false);
    setOnlineFriends(fetchedOnlineFriends);
  };

  const renderFriendItem: ListRenderItem<Friend> = ({ item }) => {
    const [collectionNumber, seedNumber] = item.avatar
      .split('-')
      .map(e => Number(e));

    return (
      <View
        style={{ flexDirection: 'row', columnGap: 12, alignItems: 'center' }}>
        <View
          style={{
            borderColor: item.isOnline
              ? ColorPalette.green[400]
              : ColorPalette.primary,
            borderWidth: 3,
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
            {item.nickName}
          </Text>

          <Text
            style={{
              color: item.isOnline
                ? ColorPalette.green[400]
                : ColorPalette.gray[400],
            }}>
            {item.isOnline ? 'Online' : 'Offline'}
          </Text>
        </View>

        <PhysicalButton
          paddingHorizontal={0}
          paddingVertical={0}
          buttonColor={ColorPalette.tertiary}
          buttonBackgroundColor={ColorPalette.tertiaryActive}
          onPress={() => {}}>
          <Text
            style={{
              color: ColorPalette.white,
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            Mời
          </Text>
        </PhysicalButton>
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
      {/* Header */}
      <View style={styles.headerRow}>
        <PhysicalButton
          paddingVertical={0}
          paddingHorizontal={0}
          width={64}
          onPress={() => {
            connection?.invoke('LeaveRoom');
            goBack();
          }}>
          <Ionicons name={'arrow-undo'} size={28} color={ColorPalette.white} />
        </PhysicalButton>

        <TouchableOpacity
          style={{ flex: 1, alignItems: 'center' }}
          onPress={copyToClipboard}>
          <Text style={styles.roomCodeTitle}>Mã phòng</Text>
          <View
            style={{
              flexDirection: 'row',
              columnGap: 4,
              alignItems: 'center',
            }}>
            <Text style={styles.roomCode}>{roomInfo.roomId}</Text>
            <Ionicons name="copy" size={20} color={ColorPalette.primary} />
          </View>
        </TouchableOpacity>

        <PhysicalButton
          paddingVertical={0}
          paddingHorizontal={0}
          onPress={handleShowInviteFriendModal}>
          <Ionicons
            name="person-add"
            size={28}
            color={ColorPalette.white}
            style={{ transform: [{ scaleX: -1 }] }}
          />
        </PhysicalButton>
      </View>

      <RoomInfo topicName={roomInfo.topic.name} points={roomInfo.points} />
      {usersInRoom.length === 0 ? (
        <View style={styles.emptyRoomCtn}>
          <Text style={styles.emptyRoomTxt}>
            {'Hãy mời thêm bạn bè\nvào phòng nhé!'}
          </Text>
        </View>
      ) : (
        <ScrollView>
          <View style={styles.gridVideo}>
            {usersInRoom.map(user => {
              // if (
              //   localVideoConsumers[user.userEmail] &&
              //   user.cameraStatus === CameraStatus.On
              // ) {
              //   const mediaStream = new MediaStream();
              //   mediaStream.addTrack(localVideoConsumers[user.userEmail].track);
              //   return (
              //     <View key={user.userEmail} style={styles.videoGridItem}>
              //       <RTCView
              //         streamURL={mediaStream.toURL()}
              //         style={{
              //           width: VIDEO_WINDOW_SIZE,
              //           height: VIDEO_WINDOW_SIZE,
              //         }}
              //         objectFit="cover"
              //       />
              //     </View>
              //   );
              // } else {
              //   const [collectionNumber, seedNumber] = user.userAvatar
              //     .split('-')
              //     .map(e => Number(e));
              //   return (
              //     <SvgXml
              //       key={user.userEmail}
              //       xml={
              //         avatarCollectionsList[collectionNumber].avatarXml(
              //           VIDEO_WINDOW_SIZE,
              //         )[seedNumber]
              //       }
              //     />
              //   );
              // }
              const [collectionNumber, seedNumber] = user.userAvatar
                .split('-')
                .map(e => Number(e));
              return (
                <View
                  key={user.userId}
                  style={{
                    backgroundColor: '#0009',
                    width: VIDEO_WINDOW_SIZE,
                    borderRadius: 6,
                  }}>
                  <SvgXml
                    xml={
                      avatarCollectionsList[collectionNumber].avatarXml(
                        VIDEO_WINDOW_SIZE,
                      )[seedNumber]
                    }
                  />
                  {roomInfo.ownerId === user.userId && (
                    <View
                      style={{
                        position: 'absolute',
                        alignSelf: 'center',
                        padding: 8,
                        borderBottomLeftRadius: 8, // Bo góc trái dưới
                        borderBottomRightRadius: 8, // Bo góc phải dưới
                        backgroundColor: ColorPalette.primary,
                      }}>
                      <FontAwesome6
                        name="crown"
                        size={24}
                        color={ColorPalette.white}
                      />
                    </View>
                  )}

                  <Text
                    style={{
                      textAlign: 'center',
                      color: ColorPalette.white,
                      paddingVertical: 4,
                      fontSize: 16,
                      fontWeight: 'bold',
                    }}>
                    {user.userNickName}
                  </Text>
                </View>
              );
            })}
          </View>
        </ScrollView>
      )}

      {/* <BottomMedia localStream={localStream} /> */}
      {isRoomOwner && usersInRoom.length >= 1 && (
        <View
          style={{
            backgroundColor: '#0009',
            padding: 20,
            paddingBottom: Math.max(insets.bottom, 20),
          }}>
          <PhysicalButton
            paddingVertical={0}
            buttonColor={ColorPalette.tertiary}
            buttonBackgroundColor={ColorPalette.tertiaryActive}
            onPress={handleStartGame}>
            <Text style={styles.btnTitle}>START</Text>
          </PhysicalButton>
        </View>
      )}

      <Modal
        animationType="fade"
        transparent
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
        onDismiss={() => setOnlineFriends(undefined)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#00000099',
          }}>
          <View
            onStartShouldSetResponder={() => true}
            style={{
              width: WIDTH - 80,
              height: 400,
              backgroundColor: '#fef8e9',
              borderRadius: 15,
              padding: 20,
              rowGap: 20,
            }}>
            <View
              style={{
                flexDirection: 'row',
                columnGap: 16,
                justifyContent: 'space-between',
                alignItems: 'center',
              }}>
              <Text style={{ fontSize: 18, fontWeight: '500' }}>
                Bạn bè đang Online
              </Text>
              <FontAwesome
                name="close"
                size={28}
                color={ColorPalette.black}
                onPress={() => setModalVisible(false)}
              />
            </View>
            {onlineFriends === undefined ? (
              <ActivityIndicator
                color={ColorPalette.black}
                size={'large'}
                style={{ flex: 1 }}
              />
            ) : (
              <FlatList
                style={{ flex: 1 }}
                data={onlineFriends}
                keyExtractor={item => item.userId}
                renderItem={renderFriendItem}
                ItemSeparatorComponent={separator}
              />
            )}
          </View>
        </Pressable>
      </Modal>
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
    columnGap: 12,
  },
  roomCodeTitle: {
    color: ColorPalette.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  roomCode: {
    color: ColorPalette.white,
    fontSize: 20,
    fontWeight: 'bold',
  },
  emptyRoomCtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyRoomTxt: {
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    color: ColorPalette.white,
  },
  gridVideo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    paddingHorizontal: 20,
  },
  videoGridItem: {
    borderRadius: 6,
    overflow: 'hidden',
    width: VIDEO_WINDOW_SIZE,
    height: VIDEO_WINDOW_SIZE,
  },
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.white,
  },
  appBtn: {
    height: 52,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: ColorPalette.primary,
  },
  separatorStyle: {
    height: 2,
    backgroundColor: ColorPalette.gray[200],
    marginVertical: 10,
  },
});
