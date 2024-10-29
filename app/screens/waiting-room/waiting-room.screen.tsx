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

import { Room } from '../make-room/make-room.type';
import { RoomHeader } from './components/room-header.component';
import { MediaStream, RTCView } from 'react-native-webrtc';

import { BottomMedia } from './components/bottom-media.component';
import { RoomInfo } from './components/room-info.component';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../pick-avatar/pick-avatar.constants';
import { useWaitingRoomSignalR } from './controllers/signal-r.controller';
import { ColorPalette } from '../../base/constants/color-palette';
import { useWaitingRoomMediaSoup } from './controllers/mediasoup.controller';
import { CameraStatus } from './waiting-room.type';

export interface WaitingRoomScreenProps {
  roomInfo: Room;
}

const VIDEO_WINDOW_SIZE = (WIDTH - 20 * 2 - 10) / 2;

export const WaitingRoomScreen = (props: WaitingRoomScreenProps) => {
  const { roomInfo } = props;

  const insets = useSafeAreaInsets();

  const {
    values: { localStream, localVideoConsumers },
    actions: { getLocalSteam },
  } = useWaitingRoomMediaSoup({ roomCode: roomInfo.roomId });

  const {
    values: { usersInRoom },
  } = useWaitingRoomSignalR({
    roomCode: roomInfo.roomId,
    getLocalSteam,
  });

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <RoomHeader roomCode={roomInfo.roomId} />
      <RoomInfo topicName={roomInfo.topic.name} round={roomInfo.round} />
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
              if (
                localVideoConsumers[user.userEmail] &&
                user.cameraStatus === CameraStatus.On
              ) {
                const mediaStream = new MediaStream();
                mediaStream.addTrack(localVideoConsumers[user.userEmail].track);
                return (
                  <View key={user.userEmail} style={styles.videoGridItem}>
                    <RTCView
                      streamURL={mediaStream.toURL()}
                      style={{
                        width: VIDEO_WINDOW_SIZE,
                        height: VIDEO_WINDOW_SIZE,
                      }}
                      objectFit="cover"
                    />
                  </View>
                );
              } else {
                const [collectionNumber, seedNumber] = user.userAvatar
                  .split('-')
                  .map(e => Number(e));
                return (
                  <SvgXml
                    key={user.userEmail}
                    xml={
                      avatarCollectionsList[collectionNumber].avatarXml(
                        VIDEO_WINDOW_SIZE,
                      )[seedNumber]
                    }
                  />
                );
              }
            })}
          </View>
        </ScrollView>
      )}

      <BottomMedia localStream={localStream} />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
    width: WIDTH,
    height: HEIGHT,
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
});
