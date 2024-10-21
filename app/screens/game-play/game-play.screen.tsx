import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  ImageBackground,
  PanResponder,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Canvas, { CanvasRenderingContext2D } from 'react-native-canvas';
import { WIDTH } from '../../base/constants/size-screen';
import { ColorPalette } from '../../base/constants/color-palette';
import { useDidMount, useWillUnmount } from 'rooks';
import { ColorBar } from './components/color-bar.component';
import Animated, { useSharedValue, withTiming } from 'react-native-reanimated';
import { Spacer } from '../../base/components/spacer.component';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Stack } from '../../base/types/stack';
import { zustandSignalR } from '../../zustand/signal-r.zustand';
import Slider from '@react-native-community/slider';
import { goBack } from '../../navigation/navation.config';
import { io } from 'socket.io-client';
import { SFU_SERVER_URL, VIDEO_PARAMS } from '../../configs/sfu-sever.config';
import {
  mediaDevices,
  MediaStream,
  MediaStreamTrack,
} from 'react-native-webrtc';
import {
  Device,
  InvalidStateError,
  Producer,
  RtpCapabilities,
  Transport,
  TransportOptions,
} from 'mediasoup-client/lib/types';
import * as mediasoupClient from 'mediasoup-client';

export interface GamePlayScreenProps {}

interface Point {
  x: number;
  y: number;
}

interface Path {
  color: string;
  lineWidth: number;
  points: Point[];
}

const socket = io(SFU_SERVER_URL + '/mediasoup');
let device: Device;
let audioTrack: MediaStreamTrack;
let videoTrack: MediaStreamTrack;

let producerTransport: Transport;
let audioProducer: Producer;
let videoProducer: Producer;

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const insets = useSafeAreaInsets();
  const activeOpacity = useSharedValue<number>(1);

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);
  const lineWidthRef = useRef(3.5);

  const pathStack = useRef(new Stack<Path>());
  const { connection, isConnected } = zustandSignalR();

  const streamSuccess = (stream: MediaStream) => {
    audioTrack = stream.getAudioTracks()[0];
    videoTrack = stream.getVideoTracks()[0];
    joinRoom();
  };

  const joinRoom = () => {
    socket.emit(
      'joinRoom',
      { roomName: '1234' },
      (serverRouterRtpCapabilities: RtpCapabilities) => {
        createDevice(serverRouterRtpCapabilities);
      },
    );
  };

  const createDevice = async (serverRouterRtpCapabilities: RtpCapabilities) => {
    try {
      device = new mediasoupClient.Device();
      await device.load({
        routerRtpCapabilities: serverRouterRtpCapabilities,
      });
      // createReceiveTransport();
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
    // see server's socket.on('createWebRtcTransport', sender?, ...)
    // this is a call from Producer, so sender = true
    socket.emit(
      'createWebRtcTransport',
      { consumer: false },
      (params: TransportOptions) => {
        // The server sends back params needed
        // to create Send Transport on the client side
        producerTransport = device.createSendTransport(params);

        // https://mediasoup.org/documentation/v3/communication-between-client-and-server/#producing-media
        // this event is raised when a first call to transport.produce() is made
        // see connectSendTransport() below
        producerTransport.on(
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

        producerTransport.on(
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
    audioProducer = await producerTransport.produce({ track: audioTrack });
    videoProducer = await producerTransport.produce({
      track: videoTrack,
      ...VIDEO_PARAMS,
    });

    audioProducer.on('trackended', () => {
      console.log('audio track ended');
      // close audio track
    });

    audioProducer.on('transportclose', () => {
      console.log('audio transport ended');
      // close audio track
    });

    videoProducer.on('trackended', () => {
      console.log('video track ended');
      // close video track
    });

    videoProducer.on('transportclose', () => {
      console.log('video transport ended');
      // close video track
    });
  };

  useEffect(() => {
    socket.on('connection-success', ({ socketId }) => {
      console.log('socketId = ' + socketId);

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

    return () => {
      console.log('socket disconnect');
      socket.disconnect();
    };
  }, []);

  useDidMount(async () => {
    if (connection && isConnected) {
      connection.on(
        'BeginPath',
        (lineColor: string, lineWidth: number, point: Point) => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            beginPath(ctx, lineColor, lineWidth, point.x, point.y);
          }
        },
      );
      connection.on('LineTo', (point: Point) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          draw(ctx, point.x, point.y);
        }
      });
      connection.on('Undo', () => {
        undoDraw();
      });
    }
  });

  useDidMount(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.width = WIDTH;
      canvas.height = WIDTH;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
      }
    }
  });

  useWillUnmount(() => {
    if (connection && isConnected) {
      connection.off('BeginPath');
      connection.off('LineTo');
      connection.off('Undo');
    }
  });

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        // Callback này được kích hoạt ngay khi người dùng bắt đầu chạm vào màn hình
        onPanResponderStart: () => {
          activeOpacity.value = withTiming(0.2);
        },
        // Callback này được kích hoạt ngay sau khi hệ thống quyết định rằng thao tác cảm ứng này sẽ được cấp quyền cho PanResponder
        onPanResponderGrant: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            connection?.invoke('BeginPath', strokeColor, lineWidthRef.current, {
              x: locationX,
              y: locationY,
            });
            beginPath(
              ctx,
              strokeColor,
              lineWidthRef.current,
              locationX,
              locationY,
            );
          }
        },
        onPanResponderMove: evt => {
          const { locationX, locationY } = evt.nativeEvent;
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            connection?.invoke('LineTo', { x: locationX, y: locationY });
            draw(ctx, locationX, locationY);
          }
        },
        onPanResponderRelease: () => {
          activeOpacity.value = withTiming(1);
        },
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [strokeColor],
  );

  const beginPath = (
    ctx: CanvasRenderingContext2D,
    lineColor: string,
    lineWidth: number,
    locationX: number,
    locationY: number,
  ) => {
    ctx.beginPath();
    ctx.moveTo(locationX, locationY);
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    pathStack.current.push({
      color: lineColor,
      lineWidth: lineWidth,
      points: [{ x: locationX, y: locationY }],
    });
  };

  const draw = (
    ctx: CanvasRenderingContext2D,
    locationX: number,
    locationY: number,
  ) => {
    ctx.lineTo(locationX, locationY);
    ctx.stroke();
    pathStack.current.peek()?.points.push({ x: locationX, y: locationY });
  };

  const undoDraw = () => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx && pathStack.current.pop()) {
      ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height); // Xóa canvas
      pathStack.current.forEach(path => {
        const points = path.points;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.strokeStyle = path.color;
        ctx.lineWidth = path.lineWidth;
        for (let i = 1; i < points.length; ++i) {
          ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
      });
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/background/background-2.png')}
      resizeMode="cover"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View
        {...panResponder.panHandlers}
        style={{ backgroundColor: ColorPalette.white }}>
        <Canvas ref={canvasRef} />
        <Animated.View
          style={[styles.topControlsCtn, { opacity: activeOpacity }]}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons name="close" size={32} color={ColorPalette.black} />
          </TouchableOpacity>
          <Spacer />
          <ColorBar onColorPressed={color => setStrokeColor(color)} />
          <Spacer />
          <TouchableOpacity
            onPress={() => {
              undoDraw();
              connection?.invoke('Undo');
            }}>
            <Ionicons
              name="arrow-undo-outline"
              size={32}
              color={ColorPalette.black}
            />
          </TouchableOpacity>
        </Animated.View>
        <Slider
          style={styles.sliderCtn}
          step={0.5}
          value={3.5}
          // vertical={true}  Note: Only for Window :)
          minimumValue={0}
          maximumValue={5}
          lowerLimit={2}
          onSlidingComplete={value => {
            lineWidthRef.current = value;
          }}
          minimumTrackTintColor={strokeColor}
          maximumTrackTintColor={ColorPalette.gray[300]}
          thumbTintColor={strokeColor}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topControlsCtn: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  sliderCtn: {
    position: 'absolute',
    right: Platform.OS === 'android' ? 4 : 16,
    bottom: Platform.OS === 'android' ? 10 : 0,
    width: 200,
  },
});
