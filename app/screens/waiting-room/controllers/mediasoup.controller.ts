import { useEffect, useRef, useState } from 'react';

import { zustandMediaSoup } from '../../../zustand/zustandMediaSoup.zustand';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from 'react-native-webrtc';
import {
  Consumer,
  ConsumerOptions,
  Device,
  InvalidStateError,
  Producer,
  RtpCapabilities,
  Transport,
  TransportOptions,
} from 'mediasoup-client/lib/types';
import * as mediasoupClient from 'mediasoup-client';
import { VIDEO_PARAMS } from '../../../configs/sfu-sever.config';
import { zustandUser } from '../../../zustand/user.zustand';
// import { CameraStatus } from '../waiting-room.type';

interface WaitingRoomMediaSoupProps {
  roomCode: string;
}

export const useWaitingRoomMediaSoup = (props: WaitingRoomMediaSoupProps) => {
  const { roomCode } = props;

  const {
    socket,
    isConnected,
    connect,
    disconnect,
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
  const [localVideoConsumers, setLocalVideoConsumers] = useState<
    Record<string, Consumer>
  >({});

  useEffect(() => {
    if (!isConnected) {
      connect();
    } else {
      socket?.emit('joinRoom', {
        email: zustandUser.getState().user.email,
        roomName: roomCode,
      });

      socket?.on('new-producer', ({ peerEmail, newProducerId }) => {
        signalNewPeer(peerEmail, newProducerId);
      });

      // socket?.on('cameraStatusChanged', ({ peerEmail, cameraStatus }) => {
      //   console.log('cameraStatusChanged');
      //   setRemoteCameraStatus(prevRemoteCameraStatus => ({
      //     ...prevRemoteCameraStatus,
      //     [peerEmail]: cameraStatus,
      //   }));
      // });

      socket?.on('producer-closed', peerEmail => {
        // setRemoteCameraStatus(prevRemoteCameraStatus => {
        //   const newState = { ...prevRemoteCameraStatus };
        //   delete newState[peerEmail];
        //   return newState;
        // });
        setLocalVideoConsumers(prevLocalVideoConsumers => {
          // Phòng trường hợp vào room, mà chưa produce media mà đã thoát room
          prevLocalVideoConsumers[peerEmail]?.close();
          const newState = { ...prevLocalVideoConsumers };
          delete newState[peerEmail];
          return newState;
        });
      });
    }
    return () => {
      if (isConnected) {
        disconnect();
        audioProducerRef.current?.close();
        videoProducerRef.current?.close();
        producerTransportRef.current?.close();
        consumerTransportRef.current?.close();
      }
    };
  }, [isConnected]);

  const getLocalSteam = () => {
    mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then(streamSuccess)
      .catch(error => {
        console.log(error.message);
      });
  };

  const streamSuccess = (stream: MediaStream) => {
    setLocalStream(stream);
    audioTrackRef.current = stream.getAudioTracks()[0];
    videoTrackRef.current = stream.getVideoTracks()[0];
    getRouterRtpCapabilities();
  };

  const getRouterRtpCapabilities = () => {
    if (socket && isConnected) {
      socket.emit(
        'getRouterRtpCapabilities',
        { roomName: roomCode },
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
                (peersProducerIds: Record<string, string[]>) => {
                  Object.keys(peersProducerIds).forEach(peerEmail => {
                    peersProducerIds[peerEmail].forEach(serverProducerId => {
                      signalNewPeer(peerEmail, serverProducerId);
                    });
                  });
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

  const signalNewPeer = async (peerEmail: string, serverProducerId: string) => {
    socket?.emit(
      'transport-recv-consume',
      {
        rtpCapabilities: deviceRef.current?.rtpCapabilities,
        serverProducerId,
      },
      async (params: ConsumerOptions) => {
        const localConsumer = await consumerTransportRef.current?.consume(
          params,
          /*
           * Đối với React-Native-WebRtc và MediaSoup trên RN
           * Nếu localConsumer là AudioTrack thì khi gọi consume ở trên,
           * => Âm thanh sẽ được tự phát
           * Khác với triển khai trên Web, cần phải tạo thẻ <audio />
           */
        );

        if (localConsumer?.kind === 'video') {
          setLocalVideoConsumers(prevLocalVideoTracks => ({
            ...prevLocalVideoTracks,
            [peerEmail]: localConsumer,
          }));
        }

        socket.emit('consumer-resume', {
          serverConsumerId: params.id, // === serverProducerId
        });
      },
    );
  };

  return {
    values: {
      localStream,
      localVideoConsumers,
      // remoteCameraStatus,
    },
    actions: {
      getLocalSteam,
    },
  };
};
