import React, { useEffect, useState } from 'react';
import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { zustandSignalR } from '../../zustand/signal-r.zustand';
import { zustandAuth } from '../../zustand/auth.zustand';
import { Room } from '../make-room/make-room.type';
import { zustandUser } from '../../zustand/user.zustand';
import { UserProfile } from '../../base/model/user-profile';
import { RoomHeader } from './components/room-header.component';
import { mediaDevices, MediaStream, RTCView } from 'react-native-webrtc';
import { useDidMount } from 'rooks';
import { Spacer } from '../../base/components/spacer.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { ColorPalette } from '../../base/constants/color-palette';
import { pop } from '../../navigation/navation.config';

export interface WaitingRoomScreenProps {
  roomInfo: Room;
}

export const WaitingRoomScreen = (props: WaitingRoomScreenProps) => {
  const { roomInfo } = props;

  const insets = useSafeAreaInsets();
  const { connection, isConnected, initializeConnection, stopConnection } =
    zustandSignalR();

  const [localStream, setLocalStream] = useState<MediaStream>();

  const streamSuccess = (stream: MediaStream) => {
    setLocalStream(stream);
    // audioTrack = stream.getAudioTracks()[0];
    // videoTrack = stream.getVideoTracks()[0];
    // joinRoom();
  };

  useDidMount(() => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(streamSuccess)
      .catch(error => {
        console.log(error.message);
      });
  });

  useEffect(() => {
    if (!isConnected) {
      initializeConnection(zustandAuth.getState().accessToken);
    } else {
      connection?.invoke('JoinRoom', {
        userEmail: zustandUser.getState().user.email,
        roomId: roomInfo.roomId,
      });

      connection?.on('JoinRoom', (userProfile: UserProfile) => {
        console.log(`${userProfile.email} just joined room`);
      });

      connection?.on('LeaveRoom', (userEmail: string) => {
        console.log(`${userEmail} just left room`);
      });
    }

    return () => {
      if (isConnected) {
        connection?.invoke('LeaveRoom');
        setTimeout(() => stopConnection(), 1000);
      }
    };
  }, [isConnected]);

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <RoomHeader roomInfo={roomInfo} />
      <Spacer />
      <View
        style={[
          styles.bottomMediaControls,
          {
            paddingBottom: Math.max(insets.bottom, 20),
          },
        ]}>
        <View style={styles.cameraCnt}>
          {localStream && (
            <RTCView
              streamURL={localStream.toURL()} // streamURL là thuộc tính để truyền MediaStream
              style={styles.cameraView}
              objectFit="cover"
            />
          )}
        </View>

        <View
          style={{
            flex: 1,
            rowGap: 12,
          }}>
          <View style={{ flex: 1, flexDirection: 'row', columnGap: 12 }}>
            <TouchableOpacity
              style={[
                styles.controlBtn,
                { backgroundColor: ColorPalette.blue[800] },
              ]}>
              <Ionicons name="videocam" size={40} color={ColorPalette.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.controlBtn,
                { backgroundColor: ColorPalette.green[700] },
              ]}>
              <Ionicons name="mic" size={40} color={ColorPalette.white} />
            </TouchableOpacity>
          </View>

          <View style={{ flex: 1, flexDirection: 'row', columnGap: 12 }}>
            <TouchableOpacity
              style={[
                styles.controlBtn,
                { backgroundColor: ColorPalette.gray[500] },
              ]}>
              <Entypo
                name="dots-three-horizontal"
                size={40}
                color={ColorPalette.white}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pop(2)}
              style={[
                styles.controlBtn,
                { backgroundColor: ColorPalette.red[700] },
              ]}>
              <FontAwesome6
                name="phone-flip"
                size={36}
                color={ColorPalette.white}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    rowGap: 16,
    width: WIDTH,
    height: HEIGHT,
    paddingHorizontal: 20,
  },
  cameraCnt: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    aspectRatio: 1,
  },
  cameraView: {
    width: '100%',
    height: '100%',
  },
  bottomMediaControls: {
    flexDirection: 'row',
    columnGap: 12,
    width: WIDTH,
    alignSelf: 'center',
    backgroundColor: '#0009',
    padding: 20,
  },
  controlBtn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});
