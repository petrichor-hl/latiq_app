import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MediaStream, RTCView } from 'react-native-webrtc';
import { ColorPalette } from '../../../base/constants/color-palette';
import { goBack } from '../../../navigation/navation.config';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { zustandUser } from '../../../zustand/user.zustand';
import { SvgXml } from 'react-native-svg';
import { avatarCollectionsList } from '../../pick-avatar/pick-avatar.constants';
import { zustandMediaSoup } from '../../../zustand/media-soup.zustand';
import { PhysicalButton } from '../../../base/components/physical-button.component';
import { zustandSignalR } from '../../../zustand/signal-r.zustand';
import { EnumSoundName } from '../../../base/constants/sound-name';
import { playSound } from '../../../base/helpers/sound.helper';
// import { CameraStatus } from '../waiting-room.type';

interface BottomMediaProps {
  isRoomOwner: boolean;
  readyToStart: boolean;
  handleStartGame: () => void;
  localStream?: MediaStream;
}

export const BottomMedia = (props: BottomMediaProps) => {
  const { isRoomOwner, readyToStart, handleStartGame, localStream } = props;

  const [collectionNumber, seedNumber] = zustandUser
    .getState()
    .user.avatar.split('-')
    .map(e => Number(e));

  const insets = useSafeAreaInsets();
  const { connection } = zustandSignalR.getState();

  const { audioProducer, videoProducer } = zustandMediaSoup();
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
          <PhysicalButton
            height={(videoLayoutSize - 12) / 2}
            width={(videoLayoutSize - 12) / 2}
            buttonColor={ColorPalette.secondary}
            buttonBackgroundColor={ColorPalette.secondaryActive}
            onPress={() => {
              //  Trong file singal-r.controller.ts
              //  có đoạn setTimeout(getLocalSteam, 500);
              //  Lúc này videoProducer của camera chưa được khởi tạo
              //  Nên khi người dùng nhấn button này chúng ta không làm gì cả
              //  Để giảm các công việc thực thi
              //
              if (videoProducer) {
                if (videoProducer.paused) {
                  videoProducer.resume();
                } else {
                  videoProducer.pause();
                }
                // connection?.invoke(
                //   'ChangeCameraStatus',
                //   videoProducer?.paused ? CameraStatus.Off : CameraStatus.On,
                // );
                toggleCamera(videoProducer.paused);
              }
            }}>
            <Ionicons
              name={isCameraOff ? 'videocam-off' : 'videocam'}
              size={40}
              color={ColorPalette.white}
            />
          </PhysicalButton>

          <PhysicalButton
            height={(videoLayoutSize - 12) / 2}
            width={(videoLayoutSize - 12) / 2}
            buttonColor={ColorPalette.green[700]}
            buttonBackgroundColor={ColorPalette.green[900]}
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
          </PhysicalButton>
        </View>

        {isRoomOwner ? (
          <PhysicalButton
            height={(videoLayoutSize - 12) / 2}
            buttonColor={
              readyToStart ? ColorPalette.tertiary : ColorPalette.gray[400]
            }
            buttonBackgroundColor={
              readyToStart
                ? ColorPalette.tertiaryActive
                : ColorPalette.gray[600]
            }
            onPress={readyToStart ? handleStartGame : undefined}>
            <Text style={styles.btnTitle}>START</Text>
          </PhysicalButton>
        ) : (
          <PhysicalButton
            height={(videoLayoutSize - 12) / 2}
            buttonColor={ColorPalette.tertiary}
            buttonBackgroundColor={ColorPalette.tertiaryActive}
            onPress={() => {
              connection?.invoke('LeaveRoom');
              goBack();
              playSound(
                EnumSoundName.Lobby,
                true,
                Platform.OS === 'android' ? 0.2 : 1,
              );
            }}>
            <FontAwesome6
              name="phone-flip"
              size={36}
              color={ColorPalette.white}
            />
          </PhysicalButton>
        )}
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
  btnTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: ColorPalette.white,
  },
});
