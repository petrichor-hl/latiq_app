import React from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { RoomHeader } from './components/room-header.component';
// import { MediaStream, RTCView } from 'react-native-webrtc';

// import { BottomMedia } from './components/bottom-media.component';
import { RoomInfo } from './components/room-info.component';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { useWaitingRoomSignalR } from './controllers/signal-r.controller';
import { ColorPalette } from '../../base/constants/color-palette';
import { PhysicalButton } from '../../base/components/physical-button.component';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
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

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <RoomHeader roomCode={roomInfo.roomId} />
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
      {isRoomOwner && usersInRoom.length >= 3 && (
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
});
