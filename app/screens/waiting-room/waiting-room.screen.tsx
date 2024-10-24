import React, { useEffect, useRef, useState } from 'react';
import { ImageBackground, StyleSheet } from 'react-native';
import { HEIGHT, WIDTH } from '../../base/constants/size-screen';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { zustandSignalR } from '../../zustand/signal-r.zustand';
import { Room } from '../make-room/make-room.type';
import { RoomHeader } from './components/room-header.component';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from 'react-native-webrtc';
import { Spacer } from '../../base/components/spacer.component';

import { zustandMediaSoup } from '../../zustand/zustandMediaSoup.zustand';
import {
  InvalidStateError,
  RtpCapabilities,
  TransportOptions,
  Device,
  Transport,
  Producer,
} from 'mediasoup-client/lib/types';
import * as mediasoupClient from 'mediasoup-client';
import { VIDEO_PARAMS } from '../../configs/sfu-sever.config';
import { BottomMedia } from './components/bottom-media.component';

export interface WaitingRoomScreenProps {
  roomInfo: Room;
}

export const WaitingRoomScreen = (props: WaitingRoomScreenProps) => {
  const { roomInfo } = props;

  const insets = useSafeAreaInsets();
  const { connection, isConnected, initializeConnection, stopConnection } =
    zustandSignalR();

  const {
    socket,
    isConnected: socketConnected,
    connect: socketConnect,
    disconnect: socketDisconnect,
    setProducerTransport,
    setConsumerTransport,
    setAudioProducer,
    setVideoProducer,
  } = zustandMediaSoup();

  const [localStream, setLocalStream] = useState<MediaStream>();
  const deviceRef = useRef<Device>();
  const producerTransportRef = useRef<Transport>();
  const consumerTransportRef = useRef<Transport>();
  const audioProducerRef = useRef<Producer>();
  const videoProducerRef = useRef<Producer>();
  const audioTrackRef = useRef<MediaStreamTrack>();
  const videoTrackRef = useRef<MediaStreamTrack>();

  useEffect(() => {
    if (!socketConnected) {
      socketConnect();
    } else {
      mediaDevices
        .getUserMedia({
          audio: true,
          video: true,
        })
        .then(streamSuccess)
        .catch(error => {
          console.log(error.message);
        });
    }

    return () => {
      if (socketConnected) {
        console.log('socketDisconnect');
        socketDisconnect();
      }
    };
  }, [socketConnected]);

  const streamSuccess = (stream: MediaStream) => {
    setLocalStream(stream);
    audioTrackRef.current = stream.getAudioTracks()[0];
    videoTrackRef.current = stream.getVideoTracks()[0];
    joinRoom();
  };

  const joinRoom = () => {
    if (socket && socketConnected) {
      socket.emit(
        'joinRoom',
        { roomName: roomInfo.roomId },
        (serverRouterRtpCapabilities: RtpCapabilities) => {
          createDevice(serverRouterRtpCapabilities);
        },
      );
    }
  };

  const createDevice = async (serverRouterRtpCapabilities: RtpCapabilities) => {
    try {
      deviceRef.current = new mediasoupClient.Device();
      await deviceRef.current?.load({
        routerRtpCapabilities: serverRouterRtpCapabilities,
      });
      createReceiveTransport();
      createSendTransport();
    } catch (error: any) {
      if (error instanceof InvalidStateError) {
        console.warn('InvalidStateError occurred');
      } else if (error instanceof TypeError) {
        console.warn('TypeError occurred');
      } else {
        console.warn('An unknown error occurred');
      }
    }
  };

  const createSendTransport = () => {
    socket?.emit(
      'createWebRtcTransport',
      { consumer: false },
      (params: TransportOptions) => {
        producerTransportRef.current =
          deviceRef.current?.createSendTransport(params);
        setProducerTransport(producerTransportRef.current);

        producerTransportRef.current?.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit(
                'transport-connect',
                {
                  dtlsParameters,
                },
                (isAlreadyMembers: boolean) => {
                  if (isAlreadyMembers) {
                    // getProducers();
                  }
                },
              );

              // Tell the transport that parameters were transmitted.
              callback();
            } catch (error: any) {
              errback(error);
            }
          },
        );

        producerTransportRef.current?.on(
          'produce',
          async (parameters, callback, errback) => {
            try {
              socket.emit(
                'transport-produce',
                {
                  kind: parameters.kind,
                  rtpParameters: parameters.rtpParameters,
                },
                (newProducerId: string) => {
                  callback({ id: newProducerId });
                },
              );
            } catch (error: any) {
              errback(error);
            }
          },
        );

        connectSendTransport();
      },
    );
  };

  const connectSendTransport = async () => {
    console.log(producerTransportRef.current);

    audioProducerRef.current = await producerTransportRef.current?.produce({
      track: audioTrackRef.current,
    });
    setAudioProducer(audioProducerRef.current);

    videoProducerRef.current = await producerTransportRef.current?.produce({
      track: videoTrackRef.current,
      ...VIDEO_PARAMS,
    });
    setVideoProducer(videoProducerRef.current);
  };

  const createReceiveTransport = () => {
    socket?.emit(
      'createWebRtcTransport',
      { consumer: true },
      (params: TransportOptions) => {
        consumerTransportRef.current =
          deviceRef.current?.createRecvTransport(params);
        setConsumerTransport(consumerTransportRef.current);

        consumerTransportRef.current?.on(
          'connect',
          async ({ dtlsParameters }, callback, errback) => {
            try {
              socket.emit('transport-recv-connect', {
                dtlsParameters,
              });
              callback();
            } catch (error: any) {
              errback(error);
            }
          },
        );
      },
    );
  };

  // useEffect(() => {
  //   if (!isConnected) {
  //     initializeConnection(zustandAuth.getState().accessToken);
  //   } else {
  //     connection?.invoke('JoinRoom', {
  //       userEmail: zustandUser.getState().user.email,
  //       roomId: roomInfo.roomId,
  //     });

  //     connection?.on('JoinRoom', (userProfile: UserProfile) => {
  //       console.log(`${userProfile.email} just joined room`);
  //     });

  //     connection?.on('LeaveRoom', (userEmail: string) => {
  //       console.log(`${userEmail} just left room`);
  //     });
  //   }

  //   return () => {
  //     if (isConnected) {
  //       connection?.invoke('LeaveRoom');
  //       setTimeout(() => stopConnection(), 1000);
  //     }
  //   };
  // }, [isConnected]);

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[styles.container, { paddingTop: insets.top }]}>
      <RoomHeader roomInfo={roomInfo} />
      <Spacer />
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
    paddingHorizontal: 20,
  },
});
