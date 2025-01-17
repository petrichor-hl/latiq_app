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
import { zustandAuth } from '../../zustand/auth.zustand';
import { zustandUser } from '../../zustand/user.zustand';
import { CameraStatus } from '../waiting-room/waiting-room.type';

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

export const GamePlayScreen = (_props: GamePlayScreenProps) => {
  const insets = useSafeAreaInsets();
  const activeOpacity = useSharedValue<number>(1);

  const canvasRef = useRef<Canvas | null>(null);
  const [strokeColor, setStrokeColor] = useState(ColorPalette.black);
  const lineWidthRef = useRef(3.5);

  const pathStack = useRef(new Stack<Path>());
  const { connection, isConnected, initializeConnection, stopConnection } =
    zustandSignalR();

  useEffect(() => {
    if (!isConnected) {
      initializeConnection(zustandAuth.getState().accessToken);
    } else {
      connection?.on(
        'BeginPath',
        (lineColor: string, lineWidth: number, point: Point) => {
          const ctx = canvasRef.current?.getContext('2d');
          if (ctx) {
            beginPath(ctx, lineColor, lineWidth, point.x, point.y);
          }
        },
      );
      connection?.on('LineTo', (point: Point) => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
          draw(ctx, point.x, point.y);
        }
      });
      connection?.on('Undo', () => {
        undoDraw();
      });
      connection?.invoke('JoinRoom', {
        userEmail: zustandUser.getState().user.email,
        userAvatar: zustandUser.getState().user.avatar,
        cameraStatus: CameraStatus.Off,
        roomId: 'test-pain',
      });
    }

    return () => {
      if (isConnected) {
        // Đệm 1s cho giao diện render mượt hơn
        setTimeout(() => stopConnection(), 1000);
      }
    };
  }, [isConnected]);

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
    [strokeColor, isConnected],
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
