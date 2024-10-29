import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MediaStream, RTCView } from 'react-native-webrtc';
import { ColorPalette } from '../../../base/constants/color-palette';
import { pop } from '../../../navigation/navation.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zustandMediaSoup } from '../../../zustand/zustandMediaSoup.zustand';
import { zustandUser } from '../../../zustand/user.zustand';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../../pick-avatar/pick-avatar.constants';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { CameraStatus } from '../waiting-room.type';

interface BottomMediaProps {
  localStream?: MediaStream;
}

export const BottomMedia = (props: BottomMediaProps) => {
  const { localStream } = props;

  const [collectionNumber, seedNumber] = zustandUser
    .getState()
    .user.avatar.split('-')
    .map(e => Number(e));

  const insets = useSafeAreaInsets();
  const { connection } = zustandSignalR();
  const { socket, audioProducer, videoProducer } = zustandMediaSoup();
  const [isMicOff, toggleMic] = useState(false);
  const [isCameraOff, toggleCamera] = useState(false);

  const [videoLayoutSize, setVideoLayoutSize] = useState(0);

  return (
    <View
      style={[
        styles.bottomMediaControls,
        {
          paddingBottom: Math.max(insets.bottom, 20),
        },
      ]}>
      <View
        style={styles.cameraCtn}
        onLayout={e => {
          setVideoLayoutSize(e.nativeEvent.layout.width);
        }}>
        {localStream && !isCameraOff ? (
          <RTCView
            streamURL={localStream.toURL()} // streamURL là thuộc tính để truyền MediaStream
            style={styles.cameraView}
            objectFit="cover"
          />
        ) : (
          <SvgXml
            xml={
              avatarCollectionsList[collectionNumber].avatarXml(
                videoLayoutSize,
              )[seedNumber]
            }
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
            ]}
            onPress={() => {
              /* Trong file singal-r.controller.ts
               * có đoạn setTimeout(getLocalSteam, 500);
               * Lúc này videoProducer của camera chưa được khởi tạo
               * Nên khi người dùng nhấn button này chúng ta không làm gì cả
               * Để giảm các công việc thực thi
               */
              if (videoProducer) {
                if (videoProducer.paused) {
                  videoProducer.resume();
                } else {
                  videoProducer.pause();
                }
                connection?.invoke(
                  'ChangeCameraStatus',
                  videoProducer?.paused ? CameraStatus.Off : CameraStatus.On,
                );
                toggleCamera(videoProducer.paused);
              }
            }}>
            <Ionicons
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={40}
              color={ColorPalette.white}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.controlBtn,
              { backgroundColor: ColorPalette.green[700] },
            ]}
            onPress={() => {
              if (audioProducer) {
                if (audioProducer.paused) {
                  audioProducer.resume();
                } else {
                  audioProducer.pause();
                }
                toggleMic(audioProducer.paused);
              }
            }}>
            <Ionicons
              name={isMicOff ? 'mic-off' : 'mic'}
              size={40}
              color={ColorPalette.white}
            />
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
  );
};

const styles = StyleSheet.create({
  cameraCtn: {
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
